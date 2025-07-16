<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistrationRequest;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Facultee;
use Illuminate\Support\Str;
use App\Models\Societe;
use App\Models\Tenants;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $email = $request->email;
        $token = Auth::attempt($request->validated());

        if ($email !== env("ADMIN_EMAIL")) {
            $tenant = Tenants::where("email", $email)->firstOrFail();
            $this->ChangeToTenant($tenant->database);
        }

        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'error creating the token'
            ], 401);
        }
        if (Auth::user() && Auth::user()->email_verified_at === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please verify your email before logging in.'
            ], 403);
        }
        return $this->responseWithToken($token, Auth::user());
    }

    public function register(RegistrationRequest $request)
    {
        $loggedIN = Auth::guard('api')->user();
        // echo($loggedIN);
        // $societe = Societe::on('admin')->where("id", )->first();
        // $this->ChangeToAdmin();

        $user = User::on('admin')->create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => null,
            'phone' => $request->phone,
            'societe_id' => $loggedIN->societe_id,
        ]);
        $userable = null;
        if ($request->type === "employee") {
            $userable = new Employee();
        } else {
            $userable = new Etudiant();
        }
        $user->userable_type = get_class($userable) === "App\Models\Employee" ? "employee" : "etudiant";
        $user->save();

        $token = Str::random(64);
        DB::table('user_verifications')->insert([
            'user_id' => $user->id,
            'token' => $token,
            'created_at' => now(),
        ]);
        $frontendUrl = config('app.frontend_url');
        $verificationLink = $frontendUrl . '/verify-email?' . http_build_query([
            'token' => $token,
            'email' => $user->email,
            'role' => $user->userable_type,
        ]);


        // Send email
        Mail::to($user->email)->send(new \App\Mail\VerifyAccountMail($user, $verificationLink));

        return response()->json([
            'status' => 'success',
            'message' => $verificationLink
        ]);
    }

    public function verifyComplete(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|confirmed|min:6'
        ]);

        $user = User::on("admin")->where('email', $request->email)->firstOrFail();

        $verify = DB::table('user_verifications')->where('user_id', $user->id)->where('token', $request->token)->first();

        if (!$verify) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $user->password = $request->password;
        $user->email_verified_at = now();

        $this->createNewTenant($user->email, $user->societe_id);

        $userable = null;
        if ($user->userable_type === 'employee') {
            $userable = Employee::create([
                'numBadge' => $request->numBadge,
                'signature' => $request->signature ?? null
            ]);
        } elseif ($user->userable_type === "etudiant") {
            $cvPath = $request->file('cv')?->store('cv', 'public');
            $conventionPath = $request->file('convention')?->store('conventions', 'public');
            $letterPath = $request->file('letterAffectation')?->store('letters', 'public');

            $facultyInAdmin = Facultee::on("admin")->where("id", $request->facultee_id)->get();
            $faculteeInTenant = Facultee::on("tenant")->where("name", $facultyInAdmin[0]->name)->get();

            $userable = Etudiant::create([
                'cv' => $cvPath,
                'convention' => $conventionPath,
                'letterAffectation' => $letterPath,
                'facultee_id' => $faculteeInTenant[0]->id,
                'sujet_id' => $request->sujet_id,
            ]);
        }

        $this->ChangeToAdmin();

        $user->userable_id = $userable->id;
        $user->save();

        DB::table('user_verifications')->where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Account verified successfully']);
    }

    public function getUser()
    {
        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }
        return response()->json(['status' => 'success', 'user' => $user]);
    }

    public function getAllUsers()
    {
        if (DB::getDefaultConnection() !== "admin") {
            $societe = Societe::on("admin")
                ->where("raison_sociale", DB::getDatabaseName())
                ->first();
            $users = User::on("admin")
                ->where("societe_id", $societe->id)
                ->get()
                ->filter(fn($user) => $user->email !== env("ADMIN_EMAIL"))
                ->values();
        } else
            $users = User::all()->filter(fn($user) => $user->email !== env("ADMIN_EMAIL"))
                ->values();

        return response()->json(['status' => "success", 'users' => $users, "database" => DB::getConnections()]);
    }

    public function validateNewUserEmail(int $id)
    {
        $this->ChangeToTenant("perfaxis");
        $user = User::where('id', $id)->first();
        $user->markEmailAsVerified();
        return response()->json(['status' => "success", 'user' => $user]);
    }

    public function logout()
    {
        // $request->$user()->curentAccessToken()->delete();
        if (Auth::authenticate()) {
            # code...
            Auth::logout();
            return response()->json(['status' => 'success', 'message' => 'Logged out successfully']);
        }
        return response()->json(['status' => 'error', 'message' => 'user not authenticated']);
    }

    /**
     * Return a JWT token for the user.
     */
    public function responseWithToken($token, $user)
    {
        return response()->json([
            'status' => 'success',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function createNewTenant(string $email, int $societe_id)
    {
        $societe = Societe::on("admin")->where("id", $societe_id)->first();
        Tenants::create([
            'email' => $email,
            'database' => $societe->raison_sociale
        ]);
        $this->ChangeToTenant($societe->raison_sociale);
    }

    // public function updateProfile(RegistrationRequest $request) {}



    public function ChangeToTenant($dbName)
    {
        DB::purge("admin");
        DB::purge("tenant");
        Config::set('database.connections.tenant.database', $dbName);
        // Config::set('database.default', 'tenant');
        DB::reconnect("tenant");
        DB::setDefaultConnection("tenant");
    }

    public function ChangeToAdmin()
    {
        DB::purge("tenant");
        DB::purge("admin");
        // Config::set('database.default', 'admin');
        DB::reconnect("admin");
        DB::setDefaultConnection("admin");
    }
}

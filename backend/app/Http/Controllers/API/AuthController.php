<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistrationRequest;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Facultee;
use App\Models\Role;
use Illuminate\Support\Str;
use App\Models\Societe;
use App\Models\Tenants;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

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

        $user = User::on('admin')->create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => null,
            'phone' => $request->phone,
            'societe_id' => $loggedIN->societe_id,
        ]);
        $role = Role::on('admin')->where("name", $request->role)->first();

        $user->roles()->attach($role->id);
        $user->role = $role->name;

        $user->save();
        $userable = null;
        if ($request->type === "employee") {
            $userable = new Employee();
        } else {
            $userable = new Etudiant();
        }
        $user->userable_type = get_class($userable);
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
            'role' => $user->userable_type === "App\Models\Employee" ? "employee" : "etudiant",
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
        if ($user->userable_type === 'App\Models\Employee') {
            $userable = Employee::create([
                'numBadge' => $request->numBadge,
                'signature' => $request->signature ?? null
            ]);
        } elseif ($user->userable_type === "App\Models\Etudiant") {
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

        DB::table('user_verifications')->where('user_id', $user->id)->update(['is_verified' => true, 'updated_at' => now()]);

        return response()->json(['message' => 'Account verified successfully']);
    }

    public function updateProfile(Request $request, $id)
    {
        $user = User::on('admin')->findOrFail($id);
        $tenant = Tenants::on('admin')->where("email", $user->email)->first();

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cv' => 'nullable|string|max:255',
            'convention' => 'nullable|string|max:255',
            'letterAffectation' => 'nullable|string|max:255',
            'numBadge' => 'nullable|string|max:50',
            'signature' => 'nullable|string|max:255',
        ]);
        // Update base user fields
        $user->update([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'phone' => $validated['phone'],
        ]);
        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $user->profile_picture = $path;
            $user->save();
        }
        // Handle Etudiant data
        $this->ChangeToTenant($tenant->database);
        if ($user->userable_type === "App\Model\Etudiant") {
            $etudiant = Etudiant::on('tenant')->where("id", $user->userable_id)->first();
            if ($etudiant) {
                $etudiant->update([
                    'cv' => $validated['cv'] ?? $etudiant->cv,
                    'convention' => $validated['convention'] ?? $etudiant->convention,
                    'letterAffectation' => $validated['letterAffectation'] ?? $etudiant->letterAffectation,
                ]);
            }
        }
        // Handle Employee data
        if ($user->userable_type === "App\Model\Employee") {
            $employee = Employee::on('tenant')->where("id", $user->userable_id)->first();
            if ($employee) {
                $employee->update([
                    'numBadge' => $validated['numBadge'] ?? $employee->numBadge,
                    'signature' => $validated['signature'] ?? $employee->signature,
                ]);
            }
        }

        // Return updated user with relations
        // $user->load('userable');

        return response()->json($user);
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

    public function deleteUser($id)
    {
        try {
            $user = User::on('admin')->where('id', $id)->firstOrFail();
            if ($user->roles()->exists())
                $user->roles()->detach();
            if ($user->userable_type === "App\Models\Employee")
                Employee::destroy($user->userable_id);
            else {
                Etudiant::destroy($user->userable_id);
            }
            $tenant = Tenants::on('admin')->where("email", $user->email)->first();
            $tenant->delete();
            $user->delete();
            return response()->json(['status' => "success", "message" => "user deleted successfully!"], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => "error, user not found!"], 404);
        }
    }

    public function logout()
    {
        if (Auth::authenticate()) {
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
        $employee = null;
        $etudiant = null;
        if ($user->userable_type === Etudiant::class) {
            $etudiant = Etudiant::find($user->userable_id);
        }
        if ($user->userable_type === Employee::class) {
            $employee = Employee::find($user->userable_id);
        }
        return response()->json([
            'status' => 'success',
            'user' => $user,
            'employee' => $employee,
            'etudiant' => $etudiant,
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

    public function assignRolesToUsers(Request $request)
    {
        $request->validate([
            'userId' => 'required|int',
            'role' => 'required|string',
        ]);

        $user = User::on('admin')->where('id', $request->userId)->first();
        if ($user->roles()->exists())
            $user->roles()->detach();

        $role = Role::on('admin')->where("name", $request->role)->first();

        $user->roles()->attach($role->id);
        $user->role = $role->name;

        $user->save();
        return response()->json(['status' => 'success', 'message' => 'Role set successfully!']);
    }



    public function ChangeToTenant($dbName)
    {
        DB::purge('admin');
        DB::purge('tenant');
        Config::set('database.connections.tenant.database', $dbName);
        DB::setDefaultConnection('tenant');
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

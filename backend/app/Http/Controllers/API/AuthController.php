<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegistrationRequest;
use App\Models\Employee;
use App\Models\Etudiant;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $token = Auth::attempt($request->validated());

        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials. Please try again.'
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
        $request->validated();
        $userable = null;
        if ($request->type === 'employee') {
            $userable = Employee::create([
                'numBadge' => $request->numBadge,
                'signature' => $request->signature ?? null,
                'societe_id' => $request->societe_id,
            ]);
        } else {
            $userable = Etudiant::create([
                'CV' => $request->cv ?? null,
                'convention' => $request->convention ?? null,
                'letterAffectation' => $request->letterAffectation ?? null,
            ]);
        }
        $user = $userable->user()->create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => $request->password,
            'phone' => $request->phone,
            'profile_picture' => $request->profile_picture,
        ]);

        if ($user) {
            $token = Auth::login($user);
            return $this->responseWithToken($token, $user);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed. Please try again.'
            ], 500);
        }
    }

    public function getUser()
    {
        $user = Auth::guard('user-api')->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }
        return response()->json(['status' => 'success', 'user' => $user]);
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
            'token_type' => 'Bearer',
        ]);
    }
}

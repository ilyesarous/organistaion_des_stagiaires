<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenants;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class VerificationController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        $user = User::on("admin")->findOrFail($id);
        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification hash'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return response()->json(['message' => 'Email verified successfully']);
    }
}

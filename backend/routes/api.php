<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\SocieteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use Illuminate\Foundation\Auth\EmailVerificationRequest;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('societe/create', [SocieteController::class, 'create']);
Route::get('societe/getEmployees/{id}', [SocieteController::class, 'getEmployees']);


Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link sent!']);
})->middleware(['auth:sanctum', 'throttle:6,1']);

Route::get('/email/verify/{id}/{hash}', function (Request $request) {
    if (!$request->hasValidSignature()) {
        return response()->json(['message' => 'Invalid verification link'], 403);
    }

    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified']);
    }

    $request->user()->markEmailAsVerified();

    return response()->json(['message' => 'Email successfully verified']);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');


// Route::group(['middleware' => ['auth:user-api', 'checkUserToken:user-api']], function () {
    
// });
// Route::group(['prefix' => ['auth']], function () {
//     Route::get('auth/user', [AuthController::class, 'getUser']);
// });
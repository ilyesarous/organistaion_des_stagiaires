<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\Faculte\FaculteController;
use App\Http\Controllers\API\Societe\SocieteController;
use App\Http\Controllers\Auth\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


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

// Route::post('/email/verification-notification', function (Request $request) {
//     $request->user()->sendEmailVerificationNotification();
//     return response()->json(['message' => 'Verification link sent!']);
// })->middleware(['auth:sanctum', 'throttle:6,1']); // This is OK as-is

// Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
//     ->middleware('signed')->name('verification.verify');



Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/verify-complete', [AuthController::class, 'verifyComplete']);
Route::post('auth/register', [AuthController::class, 'register'])->middleware(['auth:api', 'verified']);

Route::prefix('auth')->middleware(['auth:api', 'verified', 'tenant'])->group(function () {
    Route::get('getUser', [AuthController::class, 'getUser']);
    Route::get('getAll', [AuthController::class, 'getAllUsers']);
    Route::put('setVerifEmail/{id}', [AuthController::class, 'validateNewUserEmail']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/societeAdmin', [SocieteController::class, 'getAll']);

Route::prefix('societe')->middleware(['auth:api', 'verified', 'tenant'])->group(function () {
    Route::get('/', [SocieteController::class, 'getAll']);
    Route::post('/create', [SocieteController::class, 'create']);
    Route::get('/details/{id}', [SocieteController::class, 'getSocieteById']);
    Route::delete('/delete/{id}', [SocieteController::class, 'deleteSociete']);
});

Route::get('/faculteeAdmin', [FaculteController::class, 'getAll']);

Route::prefix('facultee')->middleware(['auth:api', 'verified', 'tenant'])->group(function () {
    Route::get('/', [FaculteController::class, 'getAll']);
    Route::post('/create', [FaculteController::class, 'create']);
    Route::get('/details/{id}', [FaculteController::class, 'getFacultyById']);
    Route::delete('/delete/{id}', [FaculteController::class, 'deleteFaculty']);
});

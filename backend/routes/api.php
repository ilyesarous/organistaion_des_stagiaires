<?php

use App\Http\Controllers\Action\ActionsController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\Faculte\FaculteController;
use App\Http\Controllers\API\Societe\SocieteController;
use App\Http\Controllers\Events\EventsController;
use App\Http\Controllers\Gestion\GestionsController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\Role\RolesController;
use App\Http\Controllers\Sujet\SujetController;
use Illuminate\Support\Facades\Broadcast;
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


Broadcast::routes(['prefix' => 'api', 'middleware' => ['auth:api']]);

Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/verify-complete', [AuthController::class, 'verifyComplete']);
Route::post('auth/register', [AuthController::class, 'register'])->middleware(['auth:api', 'verified']);

Route::prefix('auth')->middleware(['auth:api', 'verified', 'tenant'])->group(function () {
    Route::get('getAll', [AuthController::class, 'getAllUsers'])->middleware(['can:superAdmin_or_admin']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('update/{id}', [AuthController::class, 'updateProfile']);
    Route::put('assignRolesToUsers', [AuthController::class, 'assignRolesToUsers'])->middleware(['can:superAdmin_or_admin']);
    Route::delete('delete/{id}', [AuthController::class, 'deleteUser'])->middleware(['can:superAdmin_or_admin']);
    Route::get('societe/users', [SocieteController::class, 'getAllUsers']);
});

Route::get('societe/employees', [SocieteController::class, 'getEmployees'])->middleware(['auth:api', 'verified', 'can:superAdmin_or_admin_or_encadrant', 'tenant']);
Route::get('societe/etudiants', [SocieteController::class, 'getEtudiants'])->middleware(['auth:api', 'verified', 'can:superAdmin_or_admin_or_encadrant', 'tenant']);

Route::prefix('societe')->middleware(['auth:api', 'verified', 'can:superAdmin', 'tenant'])->group(function () {
    Route::get('/', [SocieteController::class, 'getAll']);
    Route::post('/create', [SocieteController::class, 'create']);
    Route::get('/details/{id}', [SocieteController::class, 'getSocieteById']);
    Route::delete('/delete/{id}', [SocieteController::class, 'deleteSociete']);
});

Route::get('/faculteeAdmin', [FaculteController::class, 'getAll']);

Route::prefix('facultee')->middleware(['auth:api', 'verified', 'tenant', 'can:admin_or_HR'])->group(function () {
    Route::get('/', [FaculteController::class, 'getAll']);
    Route::post('/create', [FaculteController::class, 'create']);
    Route::get('/details/{id}', [FaculteController::class, 'getFacultyById']);
    Route::delete('/delete/{id}', [FaculteController::class, 'deleteFaculty']);
});

Route::prefix('gestion')->middleware(['auth:api', 'verified', 'tenant', 'can:superAdmin_or_admin'])->group(function () {
    Route::get('/', [GestionsController::class, 'getAll']);
    Route::get('/{id}', [GestionsController::class, "getGestionByRole"]);
});

Route::get('/action', [ActionsController::class, 'getAll'])->middleware(['can:superAdmin_or_admin']);

Route::prefix('role')->middleware(['auth:api', 'verified', 'tenant', 'can:superAdmin_or_admin'])->group(function () {
    Route::get('/', [RolesController::class, 'getAll']);
    Route::get('/getAllNames', [RolesController::class, 'getAllNames']);
    Route::post('/create', [RolesController::class, "create"]);
    Route::put('/{id}/update', [RolesController::class, 'update']);
});

Route::prefix('sujet')->middleware(['auth:api', 'verified', 'tenant'])->group(function () {
    Route::get('/', [SujetController::class, 'getAll']);
    Route::get('/{id}', [SujetController::class, 'getSujet']);
    Route::post('/create', [SujetController::class, "create"]);
    Route::put('/update/{id}', [SujetController::class, 'updateSujet']);
    Route::delete('/delete/{id}', [SujetController::class, 'delete']);
    Route::get('/getEmployeeById/{id}', [SujetController::class, 'getEmployeeById']);
    Route::get('/getEtudiantById/{id}', [SujetController::class, 'getEtudiantsById']);
    Route::post('/assignEtudiantToSujet/{id}', [SujetController::class, 'assignEtudiantToSujet']);
});

Route::prefix('chat')->middleware(['auth:api', 'verified', 'tenant'])->group(function () {
    Route::get('/{id}', [MessageController::class, 'read']);
    Route::post('/', [MessageController::class, 'store']);
});

Route::prefix('events')->middleware(['auth:api', 'verified', 'tenant'])->group(function () {
    Route::post('/create', [EventsController::class, 'createEvent'])->middleware(['can:admin']);
    Route::get('/', [EventsController::class, 'getEvents']);
    Route::put('/update/{id}', [EventsController::class, 'updateEvent'])->middleware(['can:admin']);
    Route::delete('/delete/{id}', [EventsController::class, 'deleteEvent'])->middleware(['can:admin']);
    Route::get('/details/{id}', [EventsController::class, 'getEventById'])->middleware(['can:admin']);
});

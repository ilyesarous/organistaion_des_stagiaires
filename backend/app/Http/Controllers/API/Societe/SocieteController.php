<?php

namespace App\Http\Controllers\API\Societe;

use App\Http\Controllers\Controller;
use App\Http\Requests\SocieteRequest;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Role;
use App\Models\Societe;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SocieteController extends Controller
{
    public function create(SocieteRequest $request)
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('company-logos', 'public');
                $data['logo'] = $path; // This will store the path like "company-logos/filename.jpg"
            }

            $company = Societe::updateOrCreate(
                ['uuid' => $request->uuid],
                $data
            );
            $userId = DB::table('users')->insertGetId([
                'nom' => "admin",
                'prenom' => "admin",
                'email' => "admin@" . $data["raison_sociale"] . ".com",
                'email_verified_at' => now(),
                'password' => "$2y$10$4H66smDHNSSL4QTIg1Wyq.pnHrcjOyK2g.i6NUnrL/rV2hOLyMK.G",
                'phone' => "00000000",
                'created_at' => now(),
                'updated_at' => now(),
                'societe_id' => $company->id
            ]);
            DB::table('tenants')->insert([
                'email' => "admin@" . $data["raison_sociale"] . ".com",
                'database' => $data["raison_sociale"],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $user = User::find($userId);
            $adminRole = Role::where('name', 'admin')->first();

            $user->roles()->attach($adminRole);
            $user->role = $adminRole->name;
            $user->save();

            $tenantDbName = strtolower(Str::slug($data["raison_sociale"], '_'));
            $this->createTenantDatabase($tenantDbName);

            // Run tenant migrations from /database/migrations/tenants
            Artisan::call('migrate', [
                '--path' => 'database/migrations/tenants',
                '--database' => 'tenant'
            ]);

            return response()->json([
                'message' => 'Company information saved successfully',
                'data' => $company
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error saving company information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createTenantDatabase(string $dbname)
    {

        config(['database.connections.pgcreator' => [
            'driver'   => 'pgsql',
            'host'     => env('DB_HOST', '127.0.0.1'),
            'port'     => env('DB_PORT', '5432'),
            'database' => 'postgres',
            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),
            'charset'  => 'utf8',
            'prefix'   => '',
            'schema'   => 'public',
        ]]);

        DB::connection('pgcreator')->statement("CREATE DATABASE \"$dbname\"");

        config(['database.connections.tenant.database' => $dbname]);
        DB::purge('tenant');
        DB::reconnect('tenant');
    }

    public function getEmployees()
    {
        $id = Auth::user()->societe_id;
        $employees = User::on('admin')
            ->where("societe_id", $id)
            ->where("userable_type", Employee::class)
            ->get();
        return response()->json(['employees' => $employees], 200);
    }
    public function getEtudiants()
    {
        $id = Auth::user()->societe_id;
        $etudiants = User::on('admin')
            ->where("societe_id", $id)
            ->where("userable_type", Etudiant::class)
            ->get();

        return response()->json(['etudiants' => $etudiants], 200);
    }
    public function getAllUsers()
    {
        $id = Auth::user()->societe_id;
        $users = User::on('admin')
            ->where("societe_id", $id)
            ->get();

        return response()->json(['users' => $users], 200);
    }


    public function getAll()
    {
        $societes = Societe::all()->map(function ($societe) {
            if ($societe->logo) {
                // Ensure we generate a proper public URL
                $societe->logo = asset('storage/' . $societe->logo);
            }
            return $societe;
        });
        return response()->json(['societes' => $societes], 200);
    }

    public function getSocieteById(int $id)
    {
        try {
            $societe = Societe::where("id", $id)->get();
            return response()->json(['societe' => $societe], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => "error, Societe not found!"], 404);
        }
    }

    public function deleteSociete(int $id)
    {
        try {
            User::on('admin')->where('societe_id', $id)->delete();
            if (Employee::where('societe_id', $id)->exists()) {
                Employee::where('societe_id', $id)->delete();
            }
            if (Etudiant::where('societe_id', $id)->exists()) {
                Etudiant::where('societe_id', $id)->delete();
            }
            // Delete the tenant database
            $tenantDbName = Societe::find($id)->raison_sociale;
            DB::connection('pgcreator')->statement("DROP DATABASE IF EXISTS \"$tenantDbName\"");
            // Delete the Societe record
            Societe::where('id', $id)->delete();
            // Delete the tenant record
            DB::table('tenants')->where('email', 'admin@' . $tenantDbName . '.com')->delete();
            return response()->json(['status' => "success", "message" => "societe deleted successfully!"], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => "error, Societe not found!"], 404);
        }
    }
}

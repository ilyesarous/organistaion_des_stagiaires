<?php

namespace App\Http\Controllers\Sujet;

use App\Events\SyncData;
use App\Http\Controllers\Controller;
use App\Http\Requests\SujetRequest;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Status;
use App\Models\StatusStage;
use App\Models\Sujet;
use App\Models\SujetEtudiant;
use App\Models\Tenants;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class SujetController extends Controller
{
    public function create(SujetRequest $request)
    {
        $this->authorize('admin_or_HR');
        $data = $request->validated();
        $user = User::on('admin')->find($data['employee_id']);

        $sujet = Sujet::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'competences' => $data['competences'],
            'date_debut' => $data['date_debut'],
            'date_fin' => $data['date_fin'],
            'duree' => $data['duree'],
            'nbEtudiants' => $data['nbEtudiants'],
            'typeStage' => $data['typeStage'],
            'status' => StatusStage::PENDING->value,
            'employee_id' => $user->userable_id,
        ]);

        broadcast(new SyncData("sujet"))->toOthers();

        return response()->json([
            'message' => 'Sujet information saved successfully',
            'data' => $sujet
        ]);
    }

    public function getAll()
    {
        $this->authorize('admin_or_encadrant');
        $sujets = Sujet::all();
        return response()->json([
            'data' => $sujets
        ]);
    }

    public function getSujet($id)
    {
        $this->authorize('admin_or_encadrant_or_etudiant');
        $sujet = Sujet::find($id);
        return response()->json([
            'data' => $sujet
        ]);
    }

    public function getSujetByEmployee($id)
    {
        $this->authorize('encadrant');
        // $user = User::on('admin')->find($id);
        // if (!$user) {
        //     return response()->json(['status' => 'error', 'message' => "Employee not found!"], 404);
        // }
        // echo($user);
        $sujets = Sujet::where('employee_id', $id)->get();
        return response()->json([
            'data' => $sujets
        ]);
    }

    public function updateSujet(Request $request, $id)
    {
        $this->authorize('admin_or_encadrant_or_etudiant');
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'competences' => 'required|string',
            'duree' => 'required|integer',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'nbEtudiants' => 'required|integer',
            'typeStage' => 'required|string|max:255',
            'status' => 'required|string|in:pending,in_progress,awaiting_approval,rejected,completed',
            'employee_id' => 'required|integer',
            'lien' => 'nullable|string'
        ]);

        $sujet = Sujet::findOrFail($id);
        $sujet->update($data);

        broadcast(new SyncData("sujet"))->toOthers();
        return response()->json([
            'message' => 'Sujet updated successfully',
            'sujet' => $sujet
        ]);
    }

    public function delete($id)
    {
        $this->authorize('admin_or_encadrant');
        Sujet::destroy($id);
        broadcast(new SyncData("sujet"))->toOthers();
        return response()->json([
            'message' => 'Sujet deleted successfully'
        ]);
    }

    public function assignEtudiantToSujet(Request $request)
    {
        $this->authorize('admin_or_encadrant');
        $data = $request->validate([
            'etudiant_id' => 'required|integer',
            'sujet_id' => 'required|integer',
            'raison_acceptation' => 'nullable|string',
        ]);
        $databaseName = DB::connection()->getDatabaseName();
        $user = User::on("admin")->where("id", $data['etudiant_id'])->first();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => "Etudiant not found!"], 404);
        }
        $this->ChangeToTenant($databaseName);
        $etudiant = Etudiant::find($user->userable_id);
        $sujet = Sujet::find($data['sujet_id']);
        if (!$sujet) {
            return response()->json(['status' => 'error', 'message' => "Sujet not found!"], 404);
        }
        if ($sujet->etudiants()->count() >= $sujet->nbEtudiants) {
            return response()->json(['status' => 'error', 'message' => "Nombre etudiant est supperieur aux besoin"], 404);
        }
        if ($etudiant->sujet_id) {
            return response()->json(['status' => 'error', 'message' => "Etudiant already assigned to a Sujet"], 404);
        }
        $etudiant->sujet()->associate($sujet);
        $etudiant->save();
        $sujet->status = StatusStage::IN_PROGRESS->value;
        $sujet->save();
        SujetEtudiant::create([
            'id_sujet' => $sujet->id,
            'id_etudiant' => $etudiant->id,
            'raison_acceptation' => $data['raison_acceptation'] ?? null,
            'raison_elimination' => null,
        ]);
        return response()->json([
            'message' => 'Etudiant assigned to Sujet successfully'
        ]);
    }
    public function removeEtudiantFromSujet(Request $request)
    {
        $this->authorize('admin_or_encadrant');
        $databaseName = DB::connection()->getDatabaseName();
        $data = $request->validate([
            'etudiant_id' => 'required|integer',
            'sujet_id' => 'required|integer',
            'raison_elimination' => 'nullable|string',
        ]);
        $user = User::on("admin")->where("id", $data['etudiant_id'])->first();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => "Etudiant not found!"], 404);
        }
        $this->ChangeToTenant($databaseName);
        $etudiant = Etudiant::find($user->userable_id);
        $etudiant->sujet()->dissociate();
        $etudiant->save();
        $sujet = Sujet::find($etudiant->sujet_id);
        if ($sujet && $sujet->etudiants()->count() == 0) {
            $sujet->status = StatusStage::PENDING->value;
            $sujet->save();
        }
        SujetEtudiant::where('id_sujet', $data['sujet_id'])
            ->where('id_etudiant', $etudiant->id)
            ->update(['raison_elimination' => $data['raison_elimination'] ?? null]);
        return response()->json([
            'message' => 'Etudiant removed from Sujet successfully'
        ]);
    }

    public function getEmployeeById(int $id)
    {
        try {
            $databaseName = DB::connection()->getDatabaseName();

            // Get the employee user from admin DB
            $employees = User::on("admin")
                ->where("userable_type", Employee::class)
                ->where("userable_id", $id)
                ->get();
            foreach ($employees as $emp) {
                $exists = Tenants::on("admin")
                    ->where('email', $emp->email)
                    ->where('database', $databaseName)
                    ->exists();

                if ($exists) {
                    $employee = $emp;
                }
            }

            // Verify if this employee exists in the current tenant DB


            return response()->json(['employee' => $employee], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unexpected error: ' . $th->getMessage()
            ], 500);
        }
    }

    public function getEtudiantsById(int $id)
    {
        try {
            $etudiants = [];
            $databaseName = DB::connection()->getDatabaseName();
            $listEtudiants = Etudiant::where("sujet_id", $id)->get();

            foreach ($listEtudiants as $etudiantModel) {
                // Get the corresponding admin user
                $users = User::on("admin")
                    ->where("userable_type", Etudiant::class)
                    ->where("userable_id", $etudiantModel->id)
                    ->get();
                if ($users) {
                    foreach ($users as $user) {
                        // echo($user);
                        // Check if the user exists in the current tenant database
                        $exists = Tenants::on("admin")
                        ->where('email', $user->email)
                        ->where('database', $databaseName) // <-- make sure this matches your table
                        ->exists();
                        
                        if ($exists) {
                            $etudiants[] = $user;
                        }
                    }
                }
            }
            return response()->json(['etudiants' => $etudiants, "etudiantInfos"=>$listEtudiants], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => "error, etudiant not found!"], 404);
        }
    }
    public function ChangeToTenant($dbName)
    {
        DB::purge('admin');
        DB::purge('tenant');
        Config::set('database.connections.tenant.database', $dbName);
        DB::setDefaultConnection('tenant');
    }
}

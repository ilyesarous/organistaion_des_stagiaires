<?php

namespace App\Http\Controllers\Sujet;

use App\Http\Controllers\Controller;
use App\Http\Requests\SujetRequest;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Status;
use App\Models\StatusStage;
use App\Models\Sujet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            'duree' => $data['duree'],
            'nbEtudiants' => $data['nbEtudiants'],
            'typeStage' => $data['typeStage'],
            'status' => StatusStage::PENDING->value,
            'employee_id' => $user->userable_id,
        ]);

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

    public function updateSujet(Request $request, $id)
    {
        $this->authorize('admin_or_encadrant');
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'competences' => 'required|string|max:255',
            'duree' => 'required|integer',
            'nbEtudiants' => 'required|integer',
            'typeStage' => 'required|string|max:255',
            'status' => 'required|string|in:pending,in_progress,awaiting_approval,rejected,completed',
            'employee_id' => 'required|integer'
        ]);

        $sujet = Sujet::findOrFail($id);
        $sujet->update($data);
        if ($request->has('etudiants')) {
            foreach ($request->etudiants as $etudiantId) {
                $user = User::on("admin")->where("id", $etudiantId)->first();
                if (!$user) {
                    return response()->json(['status' => 'error', 'message' => "Etudiant not found!"], 404);
                }
                $etudiant = Etudiant::find($user->userable_id);
                $this->assignEtudiantToSujet($etudiant, $sujet);
            }
        }

        return response()->json([
            'message' => 'Sujet updated successfully',
            'sujet' => $sujet
        ]);
    }

    public function delete($id)
    {
        $this->authorize('admin_or_encadrant');
        Sujet::destroy($id);
        return response()->json([
            'message' => 'Sujet deleted successfully'
        ]);
    }

    public function assignEtudiantToSujet(Etudiant $etudiant, Sujet $sujet)
    {
        $this->authorize('encadrant');
        $etudiant->sujet()->associate($sujet);
        $sujet->status = StatusStage::IN_PROGRESS->value;
        $etudiant->save();
        $sujet->save();
        return response()->json([
            'message' => 'Etudiant assigned to Sujet successfully'
        ]);
    }

    public function getEmployeeById(int $id)
    {
        try {
            $employee = User::on("admin")->where("userable_type", Employee::class)->where("userable_id", $id)->first();
            return response()->json(['employee' => $employee], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => "error, employee not found!"], 404);
        }
    }
    public function getEtudiantsById(int $id)
    {
        try {
            $listEtudiants = Etudiant::where("sujet_id", $id)->get();
            foreach ($listEtudiants as $e) {
                $etudiants[] = User::on("admin")->where("userable_type", Etudiant::class)->where("userable_id", $e->id)->first();
            }
            return response()->json(['etudiants' => $etudiants], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => "error, etudiant not found!"], 404);
        }
    }
}

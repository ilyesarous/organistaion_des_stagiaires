<?php

namespace App\Http\Controllers\Sujet;

use App\Http\Controllers\Controller;
use App\Http\Requests\SujetRequest;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Sujet;
use App\Models\User;

class SujetController extends Controller
{
    public function create(SujetRequest $request)
    {
        $data = $request->validated();
        $user = User::on('admin')->find($data['employee_id']);

        $sujet = Sujet::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'competences' => $data['competences'],
            'duree' => $data['duree'],
            'nbEtudiants' => $data['nbEtudiants'],
            'typeStage' => $data['typeStage'],
            'employee_id' => $user->userable_id,
        ]);

        return response()->json([
            'message' => 'Sujet information saved successfully',
            'data' => $sujet
        ]);
    }

    public function getAll()
    {
        $sujets = Sujet::all();
        return response()->json([
            'data' => $sujets
        ]);
    }

    public function getSujet($id)
    {
        $sujet = Sujet::find($id);
        return response()->json([
            'data' => $sujet
        ]);
    }

    public function updateSujet(SujetRequest $request, $id)
    {
        $data = $request->validated();

        $sujet = Sujet::findOrFail($id);
        $sujet->update($data);

        return response()->json([
            'message' => 'Sujet updated successfully',
            'sujet' => $sujet
        ]);
    }

    public function delete($id)
    {
        Sujet::destroy($id);
        return response()->json([
            'message' => 'Sujet deleted successfully'
        ]);
    }

    public function assignEtudiantToSujet(int $idEtudiant, $id)
    {
        $sujet = Sujet::find($id);
        $etudiant = Etudiant::find($idEtudiant);
        $etudiant->sujet()->attach($sujet);
    }

    public function assignEmployeeToSujet(int $idEmpoyee, Sujet $sujet)
    {
        $employee = Employee::find($idEmpoyee);
        $employee->sujet()->attach($sujet);
    }
}

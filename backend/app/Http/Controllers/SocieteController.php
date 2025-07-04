<?php

namespace App\Http\Controllers;

use App\Http\Requests\SocieteRequest;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Societe;
class SocieteController extends Controller
{
    public function create(SocieteRequest $request)
    {
        $validatedData = $request->validated();

        $societe = new Societe($validatedData);
        $societe->save();

        return response()->json(['message' => 'Societe created successfully', 'societe' => $societe], 201);
    } 
    public function getEmployees($id)
    {
        
        $societe = Societe::findOrFail($id);
        
        if ($societe) {
            $employees = Employee::where('societe_id', $id)->get();
        }
        return response()->json(['employees' => $employees], 200);
    }
    public function getEtudiants($id)
    {
        $societe = Societe::findOrFail($id);
     
        if ($societe) {
            $etudiants = Etudiant::where('societe_id', $id)->get();
        }
     
        return response()->json(['etudiants' => $etudiants], 200);
    }
    public function getAll()
    {
        $societes = Societe::all();
        return response()->json(['societes' => $societes], 200);
    }
}

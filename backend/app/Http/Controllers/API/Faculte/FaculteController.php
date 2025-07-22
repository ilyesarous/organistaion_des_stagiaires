<?php

namespace App\Http\Controllers\API\Faculte;

use App\Http\Controllers\Controller;
use App\Http\Requests\FaculteRequest;
use App\Models\Etudiant;
use App\Models\Facultee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FaculteController extends Controller
{
    public function create(FaculteRequest $request)
    {
        $data = $request->validated();
        $faculte = Facultee::on("tenant")->create($data);
        // $dbName = DB::getDatabaseName();

        $faculteAdmin = Facultee::on("admin")->where("name", $data['name'])->first();
        if (!$faculteAdmin) {
            Facultee::on("admin")->create([
                'name' => $data['name'],
                'database' => DB::getDatabaseName()
            ]);
        }

        return response()->json([
            'message' => 'Faculty information saved successfully',
            'data' => $faculte
        ], 200);
    }

    public function getAll()
    {
        if (Auth::user()) {
            # code...
            $facultes = Facultee::all();
        } else {
            $facultes = Facultee::on("admin")->get();
        }
        return response()->json(['facultes' => $facultes], 200);
    }

    public function getFacultyById(int $id)
    {
        try {
            $faculte = Facultee::where("id", $id)->get();
            return response()->json(['facultes' => $faculte], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => "error, Faculty not found!"], 404);
        }
    }

    public function deleteFaculty(int $id)
    {
        try {
            Facultee::destroy($id);
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => "error, Faculty not found!"], 404);
        }
    }

    // public function getEtudiants(int $id){
    //     try {
    //         $etudiants = Etudiant::get()->where("facultee_id", $id);
    //         return response()->json(['etudiants' => $etudiants], 200);
    //     } catch (\Throwable $th) {
    //         //throw $th;
    //     }
    // }
}

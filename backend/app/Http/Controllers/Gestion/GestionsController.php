<?php

namespace App\Http\Controllers\Gestion;

use App\Http\Controllers\Controller;
use App\Models\Actions;
use App\Models\Gestion;
use Illuminate\Support\Facades\DB;

class GestionsController extends Controller
{
    public function getAll()
    {
        $gestions = Gestion::on('admin')->pluck('name')->unique()->values();
        return response()->json(["status" => "success", "gestions" => $gestions]);
    }

    public static function getGestionByRole(int $id)
    {
        $data = DB::connection('admin')->table('roles_gestions')->where('role_id', $id)->get();
        $ids = $data->pluck('gestion_id')->toArray();
        $gestions = Gestion::on('admin')->whereIn("id", $ids)->get();
        
        return $gestions;
    }
}

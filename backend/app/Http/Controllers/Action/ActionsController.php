<?php

namespace App\Http\Controllers\Action;

use App\Http\Controllers\Controller;
use App\Models\Actions;

class ActionsController extends Controller
{
    public function getAll(){
        $actions = Actions::on('admin')->pluck('name')->unique()->values();
        return response()->json(["status" => "success", "actions" => $actions]);
    }
}

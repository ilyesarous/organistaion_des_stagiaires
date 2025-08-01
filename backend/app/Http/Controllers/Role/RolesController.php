<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Gestion\GestionsController;
use App\Models\Actions;
use App\Models\Gestion;
use App\Models\Role;
use Illuminate\Http\Request;

class RolesController extends Controller
{
    public function create(Request $request)
    {
        $this->authorize('superAdmin_or_admin');
        $request->validate(['name' => "required|string"]);

        $role = Role::on('admin')->create(['name' => $request->name]);

        if ($request->has('gestions') && $request->has('actions')) {
            foreach ($request->gestions as $g) {
                foreach ($request->actions as $a) {
                    $action = Actions::on('admin')->where('name', $a)->first();
                    $gestion = Gestion::on('admin')->where('name', $g)->where('action_id', $action->id)->first();
                    $this->assignGestionToRole($role, $gestion);
                }
            }
        }
        return response()->json(["status" => "success", "role" => $role]);
    }



    public function assignGestionToRole(Role $role, Gestion $gestion)
    {
        $role->gestions()->attach($gestion);
    }

    public function getAll()
    {
        $this->authorize('superAdmin_or_admin');
        $roles = Role::on('admin')->get();
        $response = [];

        foreach ($roles as $role) {
            $gestions = GestionsController::getGestionByRole($role->id);
            $response[] = ["id" => $role->id, "name" => $role->name, "data" => $gestions];
            // echo($role->id);
        }
        return response()->json($response);
    }

    public function getAllNames()
    {
        $roles = Role::on('admin')->pluck('name')->values();

        // dd(response()->json($roles));
        return response()->json($roles);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('superAdmin_or_admin');
        $request->validate([
            'name' => 'required|string',
            'gestions' => 'array',
            'actions' => 'array',
        ]);

        $role = Role::on('admin')->findOrFail($id);
        $role->update(['name' => $request->name]);

        // Detach all existing gestions before updating
        $role->gestions()->detach();

        if ($request->has('gestions') && $request->has('actions')) {
            foreach ($request->gestions as $g) {
                foreach ($request->actions as $a) {
                    $action = Actions::on('admin')->where('name', $a)->first();
                    if (!$action) continue;

                    $gestion = Gestion::on('admin')
                        ->where('name', $g)
                        ->where('action_id', $action->id)
                        ->first();

                    if ($gestion) {
                        $this->assignGestionToRole($role, $gestion);
                    }
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Role updated successfully',
            'role' => $role,
        ]);
    }
}

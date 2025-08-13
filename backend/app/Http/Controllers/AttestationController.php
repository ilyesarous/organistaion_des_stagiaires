<?php

namespace App\Http\Controllers;

use App\Events\EventNotification;
use App\Models\Attestation;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Notification;
use App\Models\Societe;
use App\Models\Sujet;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AttestationController extends Controller
{
    public function index()
    {
        $attestations = Attestation::all();
        return response()->json(["attestations" => $attestations]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'isValid' => 'boolean',
            'isApproved' => 'boolean',
            'signature' => 'nullable|string',
            'cachet' => 'nullable|string',
            'etudiant_id' => 'required|exists:etudiants,id',
        ]);

        $attestation = Attestation::create($validated);
        $message = "l'Attestation pour le sujet: " . $validated['title'] . " a été creée.";
        $etudiant = Etudiant::findOrFail($validated["etudiant_id"]);
        $sujet = Sujet::findOrFail($etudiant->sujet_id);
        $user = User::on("admin")->where("userable_type", Employee::class)->where("userable_id", $sujet->employee_id)->firstOrFail();
        $this->createNotifications($user->id, 'New Event Created', $message);
        event(new EventNotification($message, $user->id));
        return response()->json($attestation, 201);
    }

    public function getAttesttationById($id)
    {
        $attestation = Attestation::findOrFail($id);
        if ($attestation->cachet && file_exists(storage_path('app/public/' . $attestation->cachet))) {
            $attestation->cachet = base64_encode(file_get_contents(storage_path('app/public/' . $attestation->cachet)));
        }
        return response()->json(["attestation" => $attestation], 200);
    }
    public function getAttesttationByIdEtudiant($id)
    {
        $user = User::on('admin')->findOrFail($id);
        $attestation = Attestation::where('etudiant_id', $user->userable_id)->first();
        if ($attestation->cachet && file_exists(storage_path('app/public/' . $attestation->cachet))) {
            $attestation->cachet = base64_encode(file_get_contents(storage_path('app/public/' . $attestation->cachet)));
        }
        return response()->json(["attestation" => $attestation], 200);
    }

    public function validateAttestation($id)
    {
        $this->authorize("encadrant");
        $user = Auth::user();
        $encadrant = Employee::findOrFail($user->userable_id);
        $attestation = Attestation::findOrFail($id);
        $attestation->update(['isValid' => true]);
        $attestation->update(['signature' => $encadrant->signature]);

        $message = "l'Attestation pour le sujet: " . $attestation->title . " a été validé.";
        $admin = User::on('admin')->where("role", "admin")->where("societe_id", $user->societe_id)->firstOrFail();
        $this->createNotifications($admin->id, 'New Event Created', $message);
        event(new EventNotification($message, $admin->id));

        return response()->json([
            'message' => 'Attestation validated successfully.',
            'data' => $attestation
        ], 200);
    }
    public function approveAttestation($id)
    {
        $this->authorize("admin");
        $user = Auth::user();
        $societe = Societe::on('admin')->findOrFail($user->societe_id);
        $attestation = Attestation::findOrFail($id);
        $attestation->update(['isApproved' => true]);
        $attestation->update(['cachet' => $societe->cachet]);
        $message = "l'Attestation pour le sujet: " . $attestation->title . " a été approuvé.";
        $etudiant = Etudiant::findOrFail($attestation->etudiant_id);
        $sujet = Sujet::findOrFail($etudiant->sujet_id);
        $user = User::on("admin")->where("userable_type", Employee::class)->where("userable_id", $sujet->employee_id)->firstOrFail();
        $this->createNotifications($user->id, 'New Event Created', $message);
        event(new EventNotification($message, $user->id));

        return response()->json([
            'message' => 'Attestation validated successfully.',
            'data' => $attestation
        ], 200);
    }

    public function deleteAttestation($id){
        Attestation::destroy($id);
        return response()->json(["message"=> "attestation deleted successfully"]);
    }

    private function createNotifications(int $userId, string $title, string $message): void
    {
        Notification::on('admin')->create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
        ]);
    }
}

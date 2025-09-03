<?php

namespace App\Http\Controllers;

use App\Events\EventNotification;
use App\Events\SyncData;
use App\Jobs\RevokeEtudiantAccess;
use App\Models\Attestation;
use App\Models\Employee;
use App\Models\Etudiant;
use App\Models\Notification;
use App\Models\Societe;
use App\Models\Sujet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AttestationController extends Controller
{

    public function index()
    {

        // $attestations = DB::table('attestations')
        //     ->join('sujets', 'attestations.id_sujet', '=', 'sujets.id')
        //     ->join('users as etu_users', 'attestations.id_etudiant', '=', 'etu_users.id')
        //     ->join('etudiants', 'etu_users.userable_id', '=', 'etudiants.id')
        //     ->join('users as emp_users', 'sujets.employee_id', '=', 'emp_users.userable_id')
        //     ->select(
        //         'attestations.id',
        //         'attestations.isValid',
        //         'attestations.isApproved',
        //         'sujets.title as sujet_title',
        //         'etu_users.nom as etudiant_nom',
        //         'etu_users.prenom as etudiant_prenom',
        //         'emp_users.nom as encadrant_nom',
        //         'emp_users.prenom as encadrant_prenom'
        //     )
        //     ->get();
        $attestations = Attestation::all();
        $dataToSend = [];
        foreach ($attestations as $attestation) {
            $sujet = Sujet::find($attestation->id_sujet);
            $etudiant = User::on("admin")->find($attestation->id_etudiant);
            $employee = User::on("admin")->where("userable_type", Employee::class)->where("userable_id", $sujet->employee_id)->where("societe_id", $etudiant->societe_id)->first();
            $dataToSend[] = [
                'id' => $attestation->id,
                'id_etudiant' => $etudiant->id,
                'isValid' => $attestation->isValid,
                'isApproved' => $attestation->isApproved,
                'sujet_title' => $sujet->title,
                'etudiant_nom' => $etudiant->nom,
                'etudiant_prenom' => $etudiant->prenom,
                'encadrant_nom' => $employee->nom,
                'encadrant_prenom' => $employee->prenom
            ];
        }
        return response()->json(["attestations" => $dataToSend], 200);
    }

    public function store(Request $request)
    {
        $societeId = Auth::user()->societe_id;
        $validated = $request->validate([
            'id_sujet' => 'required|integer',
            'etudiants' => 'required|array',
            'isValid' => 'boolean',
            'isApproved' => 'boolean',
        ]);

        foreach ($validated['etudiants'] as $etudiant_id) {
            $attestation = Attestation::create([
                'id_sujet'   => $validated['id_sujet'],
                'id_etudiant' => $etudiant_id,
                'isValid'    => $validated['isValid'] ?? false,
                'isApproved' => $validated['isApproved'] ?? false,
            ]);

            $etudiantUser = User::on("admin")->where("id", $etudiant_id)->where("societe_id", $societeId)->firstOrFail();
            $etudiant = Etudiant::findOrFail($etudiantUser->userable_id);
            $sujet = Sujet::findOrFail($etudiant->sujet_id);
            $employee = User::on("admin")->where("userable_type", Employee::class)->where("userable_id", $sujet->employee_id)->firstOrFail();
            $admin = User::on('admin')->where("role", "admin")->where("societe_id", $societeId)->firstOrFail();

            $message = "Nouveau demande d'attestation: " . $employee->nom . ' ' . $employee->prenom . "a demandé une attestation pour l'étudiant: " . $etudiantUser->nom . ' ' . $etudiantUser->prenom;
            $this->createNotifications($admin->id, 'New Event Created', $message);
            event(new EventNotification($message, $admin->id));
            broadcast(new SyncData("attestation"))->toOthers();

            return response()->json($attestation, 201);
        }
    }

    // public function getAttesttationById($id)
    // {
    //     $attestation = Attestation::findOrFail($id);
    //     if ($attestation->cachet && file_exists(storage_path('app/public/' . $attestation->cachet))) {
    //         $attestation->cachet = base64_encode(file_get_contents(storage_path('app/public/' . $attestation->cachet)));
    //     }
    //     return response()->json(["attestation" => $attestation], 200);
    // }
    // public function getAttesttationByIdEtudiant($id)
    // {
    //     $user = User::on('admin')->findOrFail($id);
    //     $attestation = Attestation::where('etudiant_id', $user->userable_id)->first();
    //     if ($attestation->cachet && file_exists(storage_path('app/public/' . $attestation->cachet))) {
    //         $attestation->cachet = base64_encode(file_get_contents(storage_path('app/public/' . $attestation->cachet)));
    //     }
    //     return response()->json(["attestation" => $attestation], 200);
    // }

    public function validateAttestation($id)
    {
        $this->authorize("encadrant");
        $user = Auth::user();
        $attestation = Attestation::findOrFail($id);
        $attestation->update(['isValid' => true]);
        $sujet = Sujet::findOrFail($attestation->id_sujet);

        $message = "l'Attestation pour le sujet: " . $sujet->title . " a été validé.";
        $admin = User::on('admin')->where("role", "admin")->where("societe_id", $user->societe_id)->firstOrFail();
        $this->createNotifications($admin->id, 'New Event Created', $message);
        event(new EventNotification($message, $admin->id));
        broadcast(new SyncData("attestation"))->toOthers();
        return response()->json([
            'message' => 'Attestation validated successfully.',
            'data' => $attestation
        ], 200);
    }
    public function approveAttestation($id, $nbDays)
    {
        $this->authorize("admin");
        $attestation = Attestation::findOrFail($id);
        if (!$attestation->isValid) {
            return response()->json(['error' => 'Attestation must be validated before approval.'], 404);
        }
        $attestation->update(['isApproved' => true]);
        $sujet = Sujet::findOrFail($attestation->id_sujet);
        $message = "l'Attestation pour le sujet: " . $sujet->title . " a été approuvé.";
        $user = User::on("admin")->where("userable_type", Employee::class)->where("userable_id", $sujet->employee_id)->firstOrFail();
        $this->createNotifications($user->id, 'New Event Created', $message);
        Mail::to($user->email)->send(new \App\Mail\EtudiantAccessRevokedAfterDelayMail($user, $nbDays));
        RevokeEtudiantAccess::dispatch($user->userable_id)->delay(now()->addDays($nbDays));
        event(new EventNotification($message, $user->id));
        broadcast(new SyncData("attestation"))->toOthers();
        return response()->json([
            'message' => 'Attestation validated successfully.',
            'data' => $attestation
        ], 200);
    }

    public function deleteAttestation($id)
    {
        Attestation::destroy($id);
        broadcast(new SyncData("attestation"))->toOthers();
        return response()->json(["message" => "attestation deleted successfully"]);
    }

    private function createNotifications(int $userId, string $title, string $message): void
    {
        Notification::on('admin')->create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
        ]);
    }

    public function generateAttestation($studentId)
    {
        $userAuth = Auth::user();

        $db_name = DB::getDatabaseName();
        $template = Societe::on("admin")->where('id', $userAuth->societe_id)->firstOrFail();
        $user = User::on("admin")->findOrFail($studentId);
        $this->ChangeToTenant($db_name);
        $etudiant = Etudiant::findOrFail($user->userable_id);
        $attestation = Attestation::where('id_etudiant', $user->id)->firstOrFail();
        if (!$attestation->isApproved || !$attestation->isValid) {
            return response(['error' => 'Attestation not approved or not validated'], 403);
        }

        $sujet = Sujet::where('id', $attestation->id_sujet)->firstOrFail();

        $placeholders = [
            '{{student_name}}' => $user->nom . ' ' . $user->prenom,
            '{{student_cin}}' => $user->CIN,
            '{{start_date}}' => $sujet->date_debut->format('d/m/Y'),
            '{{end_date}}' => $sujet->date_fin->format('d/m/Y'),
            '{{company_name}}' => $template->raison_sociale,
            '{{company_UUID}}' => $template->uuid,
            '{{company_address}}' => $template->address,
            '{{manager_name}}' => 'M. Hatem Arous',
            '{{issue_date}}' => now()->format('d/m/Y'),
        ];

        $html = strtr($template->html_template, $placeholders);

        return response(['attestation' => $html], 200);
    }

    public function ChangeToTenant($dbName)
    {
        DB::purge('admin');
        DB::purge('tenant');
        Config::set('database.connections.tenant.database', $dbName);
        DB::setDefaultConnection('tenant');
    }
}

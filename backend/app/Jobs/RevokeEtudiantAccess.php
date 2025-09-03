<?php

namespace App\Jobs;

use App\Models\Etudiant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RevokeEtudiantAccess implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

     protected $etudiantId;

    public function __construct($etudiantId)
    {
        $this->etudiantId = $etudiantId;
    }

    public function handle()
    {
        $etudiant = Etudiant::find($this->etudiantId);
        if ($etudiant) {
            $etudiant->hasAccess = false;
            $etudiant->save();
        }
    }
}

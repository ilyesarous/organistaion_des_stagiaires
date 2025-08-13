<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attestation extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'date_debut',
        'date_fin',
        'isValid',
        'isApproved',
        'signature',
        'cachet',
        'etudiant_id',
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attestation extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_sujet',
        'id_etudiant',
        'isValid',
        'isApproved'
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
}

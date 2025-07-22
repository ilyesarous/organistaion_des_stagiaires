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
        'isApproved'
    ];

    public function sujet()
    {
        return $this->belongsTo(Sujet::class);
    }
    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
    public function employe()
    {
        return $this->belongsTo(Employee::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sujet extends Model
{
    use HasFactory;

    protected $casts = [
        'typeStage' => TypeStage::class,
        'status' => StatusStage::class,
        'date_debut' => 'date',
        'date_fin'   => 'date',

    ];

    protected $fillable = [
        'title',
        'description',
        'competences',
        'date_debut',
        'date_fin',
        'duree',
        'nbEtudiants',
        'typeStage',
        'status',
        'lien',
        'employee_id'
    ];
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }
    public function employes()
    {
        return $this->belongsToMany(Employee::class);
    }
}

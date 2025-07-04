<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Societe extends Model
{
    use HasFactory;

    protected $fillable = [
        'matricule_fiscale',
        'uuid',
        'raison_sociale',
        'email',
        'phone',
        'site_web',
        'address',
        'cachet',
        'logo',
    ];

    public function attestations()
    {
        return $this->hasMany(Attestation::class);
    }
    public function employes()
    {
        return $this->hasMany(Employee::class);
    }
    public function sujets()
    {
        return $this->hasMany(Sujet::class);
    }
    public function facultees()
    {
        return $this->belongsToMany(Facultee::class);
    }
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }

}

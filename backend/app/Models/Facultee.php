<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facultee extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'department',
        'email',
        'phone',
        'site_web',
        'address',
    ];

    public function societes()
    {
        return $this->belongsToMany(Societe::class);
    }
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }

}

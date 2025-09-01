<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SujetEtudiant extends Model
{
    use HasFactory;
    protected $table = 'table_sujets_etudiants';
    protected $fillable = [
        'id_sujet',
        'id_etudiant',
        'raison_acceptation',
        'raison_elimination',
    ];
}

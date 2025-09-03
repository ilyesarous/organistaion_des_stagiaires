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
        'html_template'
    ];

}

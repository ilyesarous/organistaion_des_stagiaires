<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{

    protected $casts = [
        'typeAccess' => TypeAccess::class,
    ];

    protected $fillable = [
        'hasAccess',
        'typeAccess',
        'cv',
        'convention',
        'letterAffectation',
        'autreFichier',
        'facultee_id',
        'sujet_id'
    ];

    public function facultee()
    {
        return $this->belongsTo(Facultee::class);
    }
    public function attestation()
    {
        return $this->hasOne(Attestation::class);
    }
    public function sujet()
    {
        return $this->belongsTo(Sujet::class);
    }
    
    public function events()
    {
        return $this->belongsTo(Events::class);
    }

    public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }
}

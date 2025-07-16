<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{

    protected $fillable = [
        'cv',
        'convention',
        'letterAffectation',
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
        return $this->hasOne(Sujet::class);
    }
    public function employes()
    {
        return $this->belongsToMany(Employee::class);
    }

     public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }
    
}

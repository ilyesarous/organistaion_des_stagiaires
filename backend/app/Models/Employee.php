<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'numBadge',
        'signature'
    ];
    
    public function attestation()
    {
        return $this->hasOne(Attestation::class);
    }
    public function sujet(){
        return $this->hasMany(Sujet::class);
    }
    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class);
    }

     public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }
}

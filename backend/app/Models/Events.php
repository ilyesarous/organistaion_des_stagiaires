<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    use HasFactory;

    protected $casts = [
        'type' => TypeEvent::class,
    ];

    protected $fillable = [
        'title',
        'start',
        'end',
        'type',
        'room_name',
        'description',
        'calendarId'
    ];

    public function Employees()
    {
        return $this->hasMany(Employee::class);
    }
    public function Etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }
}

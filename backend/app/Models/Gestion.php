<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gestion extends Model
{

    use HasFactory;
    protected $fillable = [
        'name',
        'action_id'
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'roles_gestions');
    }
}

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

    public function sujet()
    {
        return $this->hasMany(Sujet::class);
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

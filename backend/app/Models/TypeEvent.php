<?php 

namespace App\Models;

enum TypeEvent: string
{
    case PRESENTIEL = 'presentiel';
    case ONLIGNE = "onligne";
}
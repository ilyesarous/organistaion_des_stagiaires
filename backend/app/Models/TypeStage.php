<?php 

namespace App\Models;

enum TypeStage: string
{
    case STAGE_DETE = 'stage d\'été';
    case PFE = "stage pfe";
    case PAR_ANNEE = "par année";
}
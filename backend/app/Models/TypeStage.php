<?php 

namespace App\Models;

enum TypeStage
{
    case STAGE_DETE;
    case PFE;
    case PAR_ANNEE;

    public function label(): string
    {
        return match ($this) {
            self::STAGE_DETE => 'Stage d\'été',
            self::PFE => 'PFE',
            self::PAR_ANNEE => 'par année',
        };
    }
}
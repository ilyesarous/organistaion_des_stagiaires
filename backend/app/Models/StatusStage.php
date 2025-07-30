<?php 

namespace App\Models;

enum StatusStage: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = "in_progress";
    case AWATING_APPROVAL = "awaiting_approval";
    case REJECTED = "rejected";
    case COMPLETED = "completed";
}
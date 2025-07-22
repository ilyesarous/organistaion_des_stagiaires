<?php
namespace App\Models;

enum ActionType: string
{
    case ADD = 'add';
    case UPDATE = "update";
    case DISPLAY = "display";
    case DETAIL = "detail";
    case DELETE = "delete";
}
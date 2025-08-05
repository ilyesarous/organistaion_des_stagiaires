<?php

namespace App\Http\Controllers\Events;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = Notification::on('admin')->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['notifications' => $notifications]);
    }

    public function markAsRead(Request $request)
    {
        Notification::on('admin')->where('user_id', $request->user()->id)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['updated' => true]);
    }
}

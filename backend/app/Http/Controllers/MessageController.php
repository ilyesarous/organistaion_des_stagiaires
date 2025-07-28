<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function read($id)
    {
        $messages = Message::on("admin")
            ->where(function ($query) use ($id) {
                $query->where('sender_id', $id)
                    ->orWhere('receiver_id', $id);
            })
            ->get();

        $recentMessages = $this->getRecentUsersWithMessages($id);
        return response()->json(["messages" => $messages, "recentMessages" => $recentMessages]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'sender_id' => 'required|integer',
            'receiver_id' => 'required|integer',
        ]);

        $message = Message::on("admin")->create($validated);

        event(new MessageSent($message));
        $this->read($request->sender_id);

        return response()->json(['message' => $message], 201);
    }

    public function getRecentUsersWithMessages($senderId)
    {
        $recentMessages = Message::on('admin')
            ->selectRaw('DISTINCT ON (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)) *')
            ->where(function ($query) use ($senderId) {
                $query->where('sender_id', $senderId)
                    ->orWhere('receiver_id', $senderId);
            })
            ->orderByRaw('LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC')
            ->limit(30)
            ->get();

        return $this->getFilterRecentMessages($recentMessages, $senderId);
    }

    public function getFilterRecentMessages(Collection $recentMessages, int $senderId)
    {
        $recentUsersWithMessage = [];
        $addedUserIds = [];
        foreach ($recentMessages as $message) {
            $userId = $message->sender_id == $senderId ? $message->receiver_id : $message->sender_id;

            if (!in_array($userId, $addedUserIds)) {
                $recentUsersWithMessage[] = [
                    'user_id' => $userId,
                    'message' => $message
                ];
                $addedUserIds[] = $userId;
            }
        }

        foreach ($recentUsersWithMessage as $key => $userMessage) {
            $user = User::on('admin')
                // ->select('nom', 'prenom', 'profile_picture')
                ->where('id', $userMessage['user_id'])
                ->first();
            $recentUsersWithMessage[$key]['user'] = $user;
            // $recentUsersWithMessage[$key]['nom'] = $user ? $user->nom . ' ' . $user->prenom : '';
            // $recentUsersWithMessage[$key]['profilePic'] = $user ? $user->profile_picture : '';
        }

        return $recentUsersWithMessage;
    }
}

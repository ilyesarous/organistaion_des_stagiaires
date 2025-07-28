<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public $message;
    public $receiverId;
    public $senderId;

    /**
     * Create a new event instance.
     */
    public function __construct($message)
    {
        $this->message = $message;
        $this->senderId = $message->sender_id;
        $this->receiverId = $message->receiver_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        $ids = [$this->message->sender_id, $this->message->receiver_id];
        sort($ids);
        return new PrivateChannel("messenger.{$ids[0]}.{$ids[1]}");
    }


    public function broadcastWith()
    {
        return [
            'message' => $this->message
        ];
    }
}

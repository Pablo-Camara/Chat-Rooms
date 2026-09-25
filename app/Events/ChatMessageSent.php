<?php

namespace App\Events;

use App\Http\Resources\MessageResource;
use App\Models\ChatRoomMessage;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class ChatMessageSent implements ShouldBroadcastNow
{
    public function __construct(public ChatRoomMessage $message) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('chatRoom.'.$this->message->chat_room_id)];
    }

    public function broadcastWith(): array
    {
        return ['message' => (new MessageResource($this->message))->resolve()];
    }
}

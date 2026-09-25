<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class ChatMessageViewed implements ShouldBroadcastNow
{
    public function __construct(public int $roomId) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('chatRoom.'.$this->roomId)];
    }
}

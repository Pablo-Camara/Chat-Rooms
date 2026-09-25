<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'room_id' => $this->chat_room_id,
            'sender_id' => $this->sender_id,
            'body' => $this->message,
            'sent_at' => $this->created_at->toIso8601String(),
            'read_at' => $this->viewed_at?->toIso8601String(),
        ];
    }
}

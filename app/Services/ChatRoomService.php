<?php

namespace App\Services;

use App\Models\ChatRoom;
use App\Models\User;
use Illuminate\Support\Str;

class ChatRoomService
{
    public function between(User $sender, User $receiver): ChatRoom
    {
        abort_if($sender->is($receiver), 422, 'Choose another person to start a conversation.');

        // The canonical key and database constraint prevent two rooms for the same
        // pair, including when both participants open a conversation concurrently.
        return ChatRoom::firstOrCreate(
            ['pair_key' => min($sender->id, $receiver->id).':'.max($sender->id, $receiver->id)],
            [
                'title' => 'Private conversation',
                'max_users' => 2,
                'is_private' => true,
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                // Kept for compatibility with the original schema; access uses policy checks.
                'password' => hash('sha256', Str::random(64)),
            ],
        );
    }
}

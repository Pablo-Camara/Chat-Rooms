<?php

namespace App\Policies;

use App\Models\ChatRoom;
use App\Models\User;

class ChatRoomPolicy
{
    public function view(User $user, ChatRoom $room): bool
    {
        return $room->includes($user);
    }

    public function send(User $user, ChatRoom $room): bool
    {
        return $room->includes($user);
    }
}

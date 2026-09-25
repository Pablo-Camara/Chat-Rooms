<?php

use App\Models\ChatRoom;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chatRoom.{id}', function (User $user, int $id) {
    return ChatRoom::find($id)?->includes($user) ?? false;
});

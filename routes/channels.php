<?php

use App\Models\ChatRoom;
use App\Models\ChatRoomUser;
use App\Models\User;
use App\Services\ChatRoomService;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('chatRoom.{id}', function (User $user, $id) {
    $chatRoom = ChatRoom::find($id);
    // chat room must exist
    if (empty($chatRoom)) {
        return false;
    }

    // user must be inside chat room
    $isUserInChatRoom = ChatRoomService::isUserInChatRoom($user->id, $chatRoom->id);
    if (!$isUserInChatRoom) {
        return false;
    }

    return true;
});

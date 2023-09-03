<?php

namespace App\Services;

use App\Models\ChatRoomMessage;

class ChatRoomMessageService {

    public static function createChatRoomMessage(
        $chatRoom,
        $message,
        $user,
        $destinationUser
    ) {
        $chatRoomMessage = new ChatRoomMessage();
        $chatRoomMessage->chat_room_id = $chatRoom->id;
        $chatRoomMessage->message = $message;
        $chatRoomMessage->sender_id = $user->id;
        $chatRoomMessage->receiver_id = $destinationUser->id;
        $chatRoomMessage->save();
        return $chatRoomMessage;
    }

}

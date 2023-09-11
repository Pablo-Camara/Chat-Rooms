<?php

namespace App\Services;

use App\Events\ChatMessageViewed;
use App\Models\ChatRoomMessage;
use App\Models\Notification;
use Carbon\Carbon;

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
        if ($chatRoomMessage->save() ){
            return $chatRoomMessage;
        }
        return null;
    }

    public static function readPrivateChatRoomMessages(
        $chatRoom
    ) {
        $chatRoomMessages = $chatRoom->messages()
            ->latest()
            ->paginate(5)
            ->items();
        $chatRoomMessages = array_reverse($chatRoomMessages);
        self::markChatRoomMessagesAsRead($chatRoomMessages);
        return $chatRoomMessages;
    }

    public static function markChatRoomMessagesAsRead($chatRoomMessages) {
        foreach($chatRoomMessages as $chatRoomMessage) {
            if (
                is_null($chatRoomMessage->viewed_at)
                &&
                $chatRoomMessage->sender_id !== auth()->user()->id
            ) {
                $chatRoomMessage->viewed_at = Carbon::now();
                if ($chatRoomMessage->save()) {
                    Notification::where('type', Notification::TYPE_CHAT_MESSAGE)
                        ->where('notification_id', $chatRoomMessage->id)
                        ->where('from_user_id', $chatRoomMessage->sender_id)
                        ->where('to_user_id', $chatRoomMessage->receiver_id)
                        ->delete();

                    ChatMessageViewed::dispatchIf(true, $chatRoomMessage);
                }
            }
        }
    }




}

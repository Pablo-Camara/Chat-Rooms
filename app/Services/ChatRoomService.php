<?php

namespace App\Services;

use App\Models\ChatRoom;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ChatRoomService {

    public static function getPrivateChatRoomBetweenUsers($user, $destinationUser) {
        $chatRoom = ChatRoom::where(function($query) use ($user, $destinationUser) {
            return $query->where(
                function($query) use ($user, $destinationUser) {
                    return $query->where('sender_id','=', $user->id)
                        ->where('receiver_id', '=', $destinationUser->id);
                }
            )->orWhere(
                function($query) use ($user, $destinationUser) {
                    return $query->where('sender_id','=', $destinationUser->id)
                        ->where('receiver_id', '=', $user->id);
                }
            );
        })->where('is_private', '=', 1)->first();

        return $chatRoom;
    }

    public static function createPrivateRoomBetweenUsers($user, $destinationUser) {
        $chatRoom = new ChatRoom();
        $chatRoom->title = 'Private Chat';
        $chatRoom->max_users = 2;
        $chatRoom->is_private = 1;
        $chatRoom->sender_id = $user->id;
        $chatRoom->receiver_id = $destinationUser->id;
        $chatRoom->password = Hash::make(Str::random(255));
        $chatRoom->save();
        return $chatRoom;
    }

    public static function getOrCreatePrivateRoomBetweenUsers($user, $destinationUser) {
        $chatRoom = self::getPrivateChatRoomBetweenUsers($user, $destinationUser);

        if (empty($chatRoom)) {
            $chatRoom = self::createPrivateRoomBetweenUsers($user, $destinationUser);
        }

        return $chatRoom;
    }

    public static function getPrivateChatRoomResponseData(
        $chatRoom,
        $chatRoomMessages,
        $user,
        $destinationUser
    ) {
        $response = [
            'chatRoom' => [
                'id' => $chatRoom->id,
                'messages' => array_map(
                    function ($chatMessage) {
                        return [
                            'messageId' => $chatMessage->id,
                            'message' => $chatMessage->message,
                            'dateSent' => $chatMessage->created_at,
                            'sender' => [
                                'id' => $chatMessage->sender->id,
                                'username' => $chatMessage->sender->username
                            ],
                            'receiver' => [
                                'id' => $chatMessage->receiver->id,
                                'username' => $chatMessage->receiver->username
                            ],
                        ];
                    },
                    $chatRoomMessages
                )
            ],
            'user' => [
                'id' => $user->id,
                'firstName' => $user->firstName,
                'lastName' => $user->lastName,
                'username' => $user->username,
            ],
            'destinationUser' => [
                'id' => $user->id,
                'firstName' => $destinationUser->firstName,
                'lastName' => $destinationUser->lastName,
                'username' => $destinationUser->username,
            ]
        ];

        return $response;
    }

}

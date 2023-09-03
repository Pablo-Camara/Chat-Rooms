<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    //
    public function privateChat($userId, Request $request) {
        $user = $request->user();
        $destinationUser = User::find($userId);

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

        if (empty($chatRoom)) {
            $chatRoom = new ChatRoom();
            $chatRoom->title = 'Private Chat';
            $chatRoom->max_users = 2;
            $chatRoom->is_private = 1;
            $chatRoom->sender_id = $user->id;
            $chatRoom->receiver_id = $destinationUser->id;
            $chatRoom->password = Hash::make(Str::random(255));
            $chatRoom->save();
        }

        $chatRoomMessages = $chatRoom->messages->all();

        return response()->json([
            'chatRoom' => [
                'id' => $chatRoom->id,
                'messages' => array_map(
                    function ($chatMessage) {
                        return [
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
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ChatRoomMessage;
use App\Models\User;
use App\Services\ChatRoomMessageService;
use App\Services\ChatRoomService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    //
    public function privateChat($userId, Request $request) {
        $user = $request->user();
        $destinationUser = User::find($userId);

        $chatRoom = ChatRoomService::getOrCreatePrivateRoomBetweenUsers($user, $destinationUser);


        $chatRoomMessages = $chatRoom->messages()
            ->latest()
            ->paginate(5)
            ->items();
        $chatRoomMessages = array_reverse($chatRoomMessages);

        return response()->json(
            ChatRoomService::getPrivateChatRoomResponseData(
                $chatRoom,
                $chatRoomMessages,
                $user,
                $destinationUser
            )
        );
    }

    public function sendPrivateChatMessage($userId, Request $request) {
        $user = $request->user();
        $destinationUser = User::find($userId);
        $message = $request->input('message');

        $chatRoom = ChatRoomService::getOrCreatePrivateRoomBetweenUsers(
            $user,
            $destinationUser
        );

        ChatRoomMessageService::createChatRoomMessage(
            $chatRoom,
            $message,
            $user,
            $destinationUser
        );

        $chatRoomMessages = $chatRoom->messages()
            ->latest()
            ->paginate(5)
            ->items();
        $chatRoomMessages = array_reverse($chatRoomMessages);

        return response()->json(
            ChatRoomService::getPrivateChatRoomResponseData(
                $chatRoom,
                $chatRoomMessages,
                $user,
                $destinationUser
            )
        );
    }
}

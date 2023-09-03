<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ChatRoomService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    //
    public function privateChat($userId, Request $request) {
        $user = $request->user();
        $destinationUser = User::find($userId);

        $chatRoom = ChatRoomService::getOrCreatePrivateRoomBetweenUsers($user, $destinationUser);

        $chatRoomMessages = $chatRoom->messages->all();

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

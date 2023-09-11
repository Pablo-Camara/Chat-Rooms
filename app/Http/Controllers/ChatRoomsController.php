<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ChatRoomMessageService;
use App\Services\ChatRoomService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChatRoomsController extends Controller
{
    //
    public function privateChat($userId, Request $request) {
        $user = $request->user();
        $destinationUser = User::find($userId);

        // get or create chat room record
        $chatRoom = ChatRoomService::getOrCreatePrivateRoomBetweenUsers($user, $destinationUser);

        // create chat room user entrance record
        $userInChatRoom = ChatRoomService::addUserToChatRoom($user->id, $chatRoom->id);

        if (!$userInChatRoom) {
            abort(Response::HTTP_UNAUTHORIZED);
            return;
        }

        $chatRoomMessages = ChatRoomMessageService::readPrivateChatRoomMessages($chatRoom);

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

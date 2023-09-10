<?php

namespace App\Http\Controllers;

use App\Events\ChatMessageSent;
use App\Events\NotificationSent;
use App\Models\Notification;
use App\Models\User;
use App\Services\ChatRoomMessageService;
use App\Services\ChatRoomService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ChatRoomMessagesController extends Controller
{
    public function sendPrivateChatMessage($userId, Request $request) {
        $user = $request->user();
        $destinationUser = User::find($userId);
        $message = $request->input('message');

        // get or create chat room record
        $chatRoom = ChatRoomService::getOrCreatePrivateRoomBetweenUsers(
            $user,
            $destinationUser
        );

        // create chat room user entrance record
        $userInChatRoom = ChatRoomService::addUserToChatRoom($user->id, $chatRoom->id);

        if (!$userInChatRoom) {
            abort(Response::HTTP_UNAUTHORIZED);
            return;
        }

        $chatRoomMessage = ChatRoomMessageService::createChatRoomMessage(
            $chatRoom,
            $message,
            $user,
            $destinationUser
        );

        if(!empty($chatRoomMessage)) {
            ChatMessageSent::dispatchIf(true, $chatRoomMessage);

            $chatMessageNotification = new Notification();
            $chatMessageNotification->type = Notification::TYPE_CHAT_MESSAGE;
            $chatMessageNotification->notification_id = $chatRoomMessage->id;
            $chatMessageNotification->from_user_id = $user->id;
            $chatMessageNotification->to_user_id = $destinationUser->id;

            NotificationSent::dispatchIf(
                $chatMessageNotification->save(),
                $chatMessageNotification
            );
        }


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

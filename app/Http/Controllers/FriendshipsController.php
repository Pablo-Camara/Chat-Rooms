<?php

namespace App\Http\Controllers;

use App\Events\FriendshipRequestAccepted;
use App\Events\FriendshipRequestSent;
use App\Events\NotificationSent;
use App\Models\Friendship;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FriendshipsController extends Controller
{
    //
    public function myFriends(Request $request) //@TODO: paginate, relevant ordering
    {
        $user = $request->user();
        $friends = Friendship::where(function ($query) use ($user) {
            $query->where('requester_id', $user->id)
                ->orWhere('user_id', $user->id);
        })
            ->whereNotNull('accepted_at_date')
            ->get();

        $result = [];
        foreach ($friends as $friend) {
            $result[] = array_merge(
                [
                    'requestor_id' => $user->id
                ],
                $friend->toArray()
            );
        }

        return response()->json($result);
    }

    public function addAsFriend($userId, Request $request) {
        $authUser = $request->user();
        $subjectUser = User::find($userId);
        if (empty($subjectUser)) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $friendship = new Friendship();
        $friendship->requester_id = $authUser->id;
        $friendship->user_id = $subjectUser->id;
        $friendshipRequested = $friendship->save();

        if ($friendshipRequested) {
            $friendRequestNotification = new Notification();
            $friendRequestNotification->type = Notification::TYPE_FRIEND_REQUEST;
            $friendRequestNotification->notification_id = $friendship->id;
            $friendRequestNotification->from_user_id = $authUser->id;
            $friendRequestNotification->to_user_id = $subjectUser->id;

            NotificationSent::dispatchIf(
                $friendRequestNotification->save(),
                $friendRequestNotification
            );

            FriendshipRequestSent::dispatchIf(
                true,
                $friendship
            );
        }

    }

    public function acceptAsFriend($userId, Request $request) {
        $authUser = $request->user();

        $friendship = Friendship::where('requester_id', $userId)
            ->where('user_id', $authUser->id)
            ->first();

        $now = Carbon::now();
        $friendship->accepted_at = $now;
        $friendship->accepted_at_date = $now;

        if ($friendship->save()) {
            Notification::where('type','friend_request')
                ->where('notification_id', $friendship->id)
                ->where('from_user_id', $userId)
                ->where('to_user_id', $authUser->id)
                ->delete();

            // notification to who requested the friendship
            $acceptedNotification = new Notification();
            $acceptedNotification->type = Notification::TYPE_FRIEND_REQUEST_ACCEPTED;
            $acceptedNotification->notification_id = $friendship->id;
            $acceptedNotification->from_user_id = $authUser->id;
            $acceptedNotification->to_user_id = $friendship->requester_id;

            NotificationSent::dispatchIf(
                $acceptedNotification->save(),
                $acceptedNotification
            );

            // notification to who accepted the friendship
            $acceptedNotification = new Notification();
            $acceptedNotification->type = Notification::TYPE_FRIEND_REQUEST_ACCEPTED;
            $acceptedNotification->notification_id = $friendship->id;
            $acceptedNotification->from_user_id = $friendship->requester_id;
            $acceptedNotification->to_user_id = $authUser->id;

            NotificationSent::dispatchIf(
                $acceptedNotification->save(),
                $acceptedNotification
            );


            FriendshipRequestAccepted::dispatchIf(
                true,
                $friendship
            );
        }

    }
}

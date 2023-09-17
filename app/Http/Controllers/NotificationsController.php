<?php

namespace App\Http\Controllers;

use App\Events\NotificationDeleted;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationsController extends Controller
{
    //
    public function myNotifications(Request $request) {
        $user = $request->user();
        $userNotifications = Notification::select('type','from_user_id')
            ->selectRaw('MAX(id) as id')
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('MAX(created_at) as created_at')
            ->where('to_user_id', $user->id)
            ->groupBy('type', 'from_user_id')
            ->orderByDesc('created_at')
            ->with('sender')
            ->get();

        return response()->json($userNotifications->toArray());
    }

    public function deleteNotification($notificationId, Request $request) {
        $user = $request->user();
        $notification = Notification::find($notificationId);

        if (empty($notification)) {
            abort(Response::HTTP_NOT_FOUND);
            return;
        }

        if ($notification->to_user_id !== $user->id) {
            abort(Response::HTTP_FORBIDDEN);
            return;
        }

        NotificationDeleted::dispatchIf(
            true,
            $notification
        );
        $notification->delete();
    }
}

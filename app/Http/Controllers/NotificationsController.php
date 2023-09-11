<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    //
    public function myNotifications(Request $request) {
        $user = $request->user();
        $userNotifications = Notification::select('type','from_user_id')
            ->selectRaw('COUNT(*) as count')
            ->selectRaw('MAX(created_at) as created_at')
            ->where('to_user_id', $user->id)
            ->groupBy('type', 'from_user_id')
            ->orderByDesc('created_at')
            ->with('sender')
            ->get();

        return response()->json($userNotifications->toArray());
    }
}

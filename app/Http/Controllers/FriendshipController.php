<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use Illuminate\Http\Request;

class FriendshipController extends Controller
{
    //
    public function myFriends(Request $request)
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
}

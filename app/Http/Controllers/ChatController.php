<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    //
    public function privateChat($userId, Request $request) {
        $user = $request->user();
        $destinationUser = User::find($userId);

        return response()->json([
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

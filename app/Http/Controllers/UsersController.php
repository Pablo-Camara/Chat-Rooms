<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UsersController extends Controller
{
    //
    public function findUsers(Request $request) { //@TODO: pagination
        $requestUserId = $request->user()->id;
        $searchInput = trim($request->input('searchInput', ''));
        if (empty($searchInput)) {
            //@TODO: show default search of users order by username ascending
            $results = User::select('*')
                        ->where('id', '!=', $requestUserId)
                        ->limit(10)
                        ->orderBy('username', 'asc')
                        ->get();

            $results = $results->toArray();
            return response()->json($results);
        }
        $names = explode(' ', $searchInput);
        $totalNames = count($names);
        $firstName = $names[0];
        $lastName = $names[$totalNames-1];

        $results = User::select('*')
                    ->selectRaw('
                        CASE
                            WHEN username = ? THEN 12
                            WHEN username LIKE ? THEN 11
                            WHEN username LIKE ? THEN 10
                            WHEN CONCAT(firstName, " ", lastName) = ? THEN 9
                            WHEN CONCAT(firstName, " ", lastName) LIKE ? THEN 8
                            WHEN firstName = ? THEN 7
                            WHEN lastName = ? THEN 6
                            WHEN firstName LIKE ? AND lastName LIKE ? THEN 5
                            WHEN firstName LIKE ? THEN 4
                            WHEN lastName LIKE ? THEN 3
                            ELSE 0
                        END as score',
                        [
                            $searchInput,
                            $searchInput . '%',
                            '%' . $searchInput . '%',
                            $firstName . ' ' . $lastName,
                            $firstName . ' ' . $lastName . '%',
                            $firstName,
                            $lastName,
                            '%' . $firstName . '%',
                            '%' . $lastName . '%',
                            '%' . $firstName . '%',
                            '%' . $lastName . '%',
                        ]
                    )
                    ->where(function($query) use ($searchInput, $firstName, $lastName) {
                        return $query->where('username','=',$searchInput)
                            ->orWhere('username', 'like', $searchInput . '%')
                            ->orWhere('username', 'like', '%' . $searchInput . '%')
                            ->orWhereRaw('CONCAT(firstName, " ", lastName) = ?', $firstName . ' ' . $lastName)
                            ->orWhereRaw('CONCAT(firstName, " ", lastName) LIKE ?', $firstName . ' ' . $lastName . '%')
                            ->orWhere('firstName', '=', $firstName)
                            ->orWhere('lastName', '=', $lastName)
                            ->orWhereRaw('firstName LIKE ? AND lastName LIKE ?', ['%' . $firstName . '%', '%' . $lastName . '%'])
                            ->orWhere('firstName', 'like', '%' . $firstName . '%')
                            ->orWhere('lastName', 'like', '%' . $lastName . '%');
                    })
                    ->where('id', '!=', $requestUserId)
                    ->orderBy('score', 'desc')
                    ->limit(10)
                    ->get();

        $results = $results->toArray();
        return response()->json($results);
    }

    public function getUserProfile($userId, Request $request) {
        if (empty($userId)) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $userProfile = User::select('id', 'username','firstName','lastName', 'created_at')
            ->where('id', $userId)
            ->first();

        $friendship = Friendship::where(function ($query) use ($userProfile) {
            return $query->where('requester_id', $userProfile->id)
                ->where('user_id', auth()->user()->id);
        })->orWhere(function($query) use ($userProfile) {
            return $query->where('requester_id', auth()->user()->id)
                ->where('user_id', $userProfile->id);
        })->first();

        $friendshipStatus = $userProfile->id === auth()->user()->id ? 'invalid' : null;
        if (!empty($friendship)) {
            if ($friendship->requester_id === auth()->user()->id) {
                $friendshipStatus = 'requested';
            }

            if ($friendship->requester_id === $userProfile->id) {
                $friendshipStatus = 'received_request';
            }

            if (!empty($friendship->accepted_at_date)) {
                $friendshipStatus = 'friends';
            }
        }

        return response()->json([
            'userProfile' => [
                'id' => $userProfile->id,
                'username' => $userProfile->username,
                'firstName' => $userProfile->firstName,
                'lastName' => $userProfile->lastName,
                'joinedSince' => $userProfile->created_at->diffForHumans(),
            ],
            'friendship' => [
                'status' => $friendshipStatus,
                'friendsSince' => $friendship ? $friendship->friends_since : null
            ]
        ]);
    }
}

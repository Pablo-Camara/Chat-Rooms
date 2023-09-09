<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
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
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
    public function findUsers(Request $request) {
        $requestUserId = $request->user()->id;
        $searchInput = $request->input('searchInput');
        if (strlen(trim($searchInput)) == 0) {
            return response()->json([]);
        }
        $results = User::where(function($query) use ($searchInput) {
            return $query->where('username', '=', $searchInput)
                ->orWhere('username', 'like', '%' . $searchInput . '%');
        })->orWhere(function($query) use ($searchInput) {
            $words = explode(" ", $searchInput);
            foreach($words as $word) {
                $word = trim($word);
                $query = $query->orWhere('firstName', '=', $word)
                    ->orWhere('firstName', 'like', '%' . $word . '%');
            }
            return $query;
        })->orWhere(function($query) use ($searchInput) {
            $words = explode(" ", $searchInput);
            foreach($words as $word) {
                $word = trim($word);
                $query = $query->orWhere('lastName', '=', $word)
                    ->orWhere('lastName', 'like', '%' . $word . '%');
            }
            return $query;
        })->orWhere(function($query) use ($searchInput) {
            $words = explode(" ", $searchInput);
            foreach($words as $word) {
                $word = trim($word);
                $query = $query->orWhere('lastName', '=', $word);
            }
            return $query;
        })->where(function($query) use($requestUserId) {
            return $query->where('id', '!=', $requestUserId);
        })->limit(10)->get();

        $results = $results->toArray();
        return response()->json($results);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    public function login (Request $request) {
        $username = $request->input('username');
        $password = $request->input('password');

        $user = User::where('username','=',$username)->first();

        if (
            !empty($user)
            &&
            Hash::check($password, $user->password)
        ) {
            Auth::loginUsingId($user->id);
            $token = $request->user()->createToken('auth');
            return ['token' => $token->plainTextToken];
        }

        abort(Response::HTTP_UNAUTHORIZED);
    }
}

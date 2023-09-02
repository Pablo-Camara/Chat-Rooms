<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

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
            $user = $request->user();
            $authToken = null;
            $hasAuthToken = false;
            foreach($user->tokens as $token) {
                if ($token->name === 'auth'){
                    $authToken = $token;
                    $hasAuthToken = true;
                    break;
                }
            }
            if (!$hasAuthToken) {
                $authToken = $user->createToken('auth');
            }

            return ['token' => $authToken->plainTextToken];
        }

        abort(Response::HTTP_UNAUTHORIZED);
    }

    public function logout(Request $request) {
        $user = $request->user();
        $tokenNameToDelete = 'auth';

        $user->tokens->each(function ($token) use ($tokenNameToDelete) {
            if ($token->name === $tokenNameToDelete) {
                $token->delete();
            }
        });
    }
}

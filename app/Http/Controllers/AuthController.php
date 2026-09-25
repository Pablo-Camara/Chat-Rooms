<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string', 'max:40'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages(['username' => 'The username or password is incorrect.']);
        }

        // Rotate the session identifier after authentication to prevent fixation.
        $request->session()->regenerate();

        return new UserResource($request->user());
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'firstName' => ['required', 'string', 'max:80'],
            'lastName' => ['required', 'string', 'max:80'],
            'username' => ['required', 'string', 'min:3', 'max:40', 'regex:/^[a-zA-Z0-9_.-]+$/', 'unique:users'],
            'password' => ['required', 'string', 'confirmed', 'max:255', Password::min(12)],
        ]);

        $user = User::create($data);
        Auth::login($user);
        $request->session()->regenerate();

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}

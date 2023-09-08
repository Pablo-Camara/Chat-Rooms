<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
            foreach($user->tokens as $token) {
                if ($token->name === 'auth'){
                    $authToken = $token;
                    break;
                }
            }
            if (is_null($authToken)) {
                $authToken = $user->createToken('auth');
            }

            return response()->json(['token' => $authToken->plainTextToken]);
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

    public function register(Request $request) {
        $firstName = $request->input('firstName');
        $lastName = $request->input('lastName');
        $username = $request->input('username');
        $password = $request->input('password');
        $passwordConfirmation = $request->input('passwordConfirmation');

        if ($passwordConfirmation !== $password) {
            return response()->json([
                'errors' => [
                    [
                        'text' => 'Password confirmation does not match'
                    ]
                ]
            ], Response::HTTP_BAD_REQUEST);
        }

        // Define the validation rules for your variables
        $rules = [
            'firstName' => 'required|regex:/^\S+$/|max:255',
            'lastName' => 'required|regex:/^\S+$/|max:255',
            'username' => 'required|regex:/^\S+$/|max:255|unique:users',
            'password' => 'required|max:255',
            // Add more rules for other variables here
        ];

        // Create a new Validator instance
        $validator = Validator::make([
            'firstName' => $firstName,
            'lastName' => $lastName,
            'username' => $username,
            'password' => $password,
        ], $rules, [
            'firstName.regex' => 'The :attribute field may not contain spaces',
            'lastName.regex' => 'The :attribute field may not contain spaces',
            'username.regex' => 'The :attribute field may not contain spaces',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            // Validation failed; return validation errors as a response
            $formattedErrors = [];

            // Loop through each field and its error messages
            foreach ($validator->errors()->messages() as $field => $errorMessages) {
                foreach ($errorMessages as $errorMessage) {
                    // Build the desired structure for each error
                    $formattedErrors[] = [
                        "text" => $errorMessage
                    ];
                }
            }
            return response()->json(
                [
                    'errors' => $formattedErrors
                ],
                Response::HTTP_BAD_REQUEST
            );
        }


        // Create new user
        $newUser = new User([
            'firstName' => $firstName,
            'lastName' => $lastName,
            'username' => $username,
            'password' => Hash::make($password)
        ]);
        $newUser->save();
        Auth::loginUsingId($newUser->id);
        $authToken = $request->user()->createToken('auth');

        return response()->json(['token' => $authToken->plainTextToken]);

    }
}

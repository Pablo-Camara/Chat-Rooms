<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [ AuthController::class, 'logout' ]);
    Route::get('/friends', [ FriendshipController::class, 'myFriends' ]);
    Route::post('/find-users', [ UserController::class, 'findUsers' ]);

    Route::get('/chat/{userId}', [ ChatController::class, 'privateChat' ]);
    Route::post('/chat/{userId}/msg', [ ChatController::class, 'sendPrivateChatMessage' ]);
});

Route::post('/login', [ AuthController::class, 'login' ]);
Route::post('/register', [ AuthController::class, 'register' ]);

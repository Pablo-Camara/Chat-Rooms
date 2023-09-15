<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatRoomMessagesController;
use App\Http\Controllers\ChatRoomsController;
use App\Http\Controllers\FriendshipsController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\UsersController;
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

    Route::post('/logout', [ AuthController::class, 'logout' ]);
    Route::get('/notifications', [ NotificationsController::class, 'myNotifications' ]);
    Route::get('/notifications/delete/{notificationId}', [ NotificationsController::class, 'deleteNotification' ]);
    Route::get('/friends', [ FriendshipsController::class, 'myFriends' ]);
    Route::get('/add-friend/{userId}', [ FriendshipsController::class, 'addAsFriend' ]);
    Route::get('/accept-friend/{userId}', [ FriendshipsController::class, 'acceptAsFriend' ]);
    Route::post('/find-users', [ UsersController::class, 'findUsers' ]);


    Route::get('/user/{userId}', [ UsersController::class, 'getUserProfile' ]);

    Route::get('/chat/{userId}', [ ChatRoomsController::class, 'privateChat' ]);
    Route::post('/chat/{userId}/msg', [ ChatRoomMessagesController::class, 'sendPrivateChatMessage' ]);
});

Route::post('/login', [ AuthController::class, 'login' ]);
Route::post('/register', [ AuthController::class, 'register' ]);

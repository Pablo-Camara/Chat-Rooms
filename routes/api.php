<?php

use App\Http\Controllers\ChatRoomMessagesController;
use App\Http\Controllers\ChatRoomsController;
use App\Http\Controllers\FriendshipsController;
use App\Http\Controllers\UsersController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', fn (Request $request) => new UserResource($request->user()));
    Route::get('/users', [UsersController::class, 'index']);
    Route::get('/friendships', [FriendshipsController::class, 'index']);
    Route::post('/friendships/{user}', [FriendshipsController::class, 'store'])->middleware('throttle:20,1');
    Route::put('/friendships/{friendship}', [FriendshipsController::class, 'accept']);
    Route::delete('/friendships/{friendship}', [FriendshipsController::class, 'destroy']);
    Route::get('/conversations', [ChatRoomsController::class, 'index']);
    Route::post('/conversations', [ChatRoomsController::class, 'store']);
    Route::get('/conversations/{room}/messages', [ChatRoomMessagesController::class, 'index']);
    Route::post('/conversations/{room}/messages', [ChatRoomMessagesController::class, 'store'])->middleware('throttle:30,1');
    Route::post('/conversations/{room}/read', [ChatRoomMessagesController::class, 'read']);
});

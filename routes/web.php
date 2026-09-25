<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Browser authentication uses an HttpOnly session cookie and Laravel's CSRF middleware.
Route::post('/api/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/api/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/api/logout', [AuthController::class, 'logout'])->middleware('auth');
Route::view('/{path?}', 'welcome')->where('path', '(?!api/).*')->name('login');

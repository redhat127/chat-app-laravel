<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware('guest')
    ->group(function () {
        Route::prefix('login')
            ->name('login.')
            ->controller(LoginController::class)
            ->group(function () {
                Route::post('/', 'post')->name('post');
                Route::get('/{provider}/redirect', 'redirect')->name('provider.redirect');
                Route::get('/{provider}/callback', 'callback')->name('provider.callback');
            });
    });

Route::middleware('auth')
    ->group(function () {
        Route::prefix('logout')
            ->name('logout.')
            ->controller(LogoutController::class)
            ->group(function () {
                Route::post('/', 'index')->name('index');
            });

        Route::prefix('account')
            ->name('account.')
            ->controller(AccountController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('/profile-details', 'profileDetails')->name('profileDetails');
                Route::post('/set-password', 'setPassword')->name('setPassword');
            });

        Route::prefix('room')
            ->name('room.')
            ->controller(ChatRoomController::class)
            ->group(function () {
                Route::get('/create', 'createRoom')->name('createRoom');
                Route::post('/create', 'createRoomPost')->name('createRoomPost');
                Route::post('/join-room', 'joinRoom')->name('joinRoom');
                Route::post('/leave-room', 'leaveRoom')->name('leaveRoom');
            });
    });

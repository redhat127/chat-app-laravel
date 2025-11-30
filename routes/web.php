<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('home');
})->name('home');

Route::middleware('guest')
    ->group(function () {
        Route::prefix('login')
            ->name('login.')
            ->controller(LoginController::class)
            ->group(function () {
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
    });

<?php

use App\Http\Controllers\LoginController;
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

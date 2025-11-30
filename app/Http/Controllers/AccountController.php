<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    public function index()
    {
        return inertia('account/index');
    }

    public function profileDetails()
    {
        $validated = request()->validate([
            'name' => ['bail', 'required', 'string', 'min:1', 'max:50', 'regex:/^[A-Za-z0-9 _-]+$/'],
        ]);

        Auth::user()->update($validated);

        return back()->with('flashMessage', [
            'type' => 'success',
            'text' => 'Your profile details have been updated.',
        ]);
    }

    public function setPassword()
    {
        $validated = request()->validate([
            'password' => ['bail', 'required', 'string', 'min:10', 'max:50', 'confirmed'],
            'password_confirmation' => ['bail', 'required', 'string', 'min:10', 'max:50'],
        ]);

        Auth::user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('flashMessage', [
            'type' => 'success',
            'text' => 'Password has been set.',
        ]);
    }
}

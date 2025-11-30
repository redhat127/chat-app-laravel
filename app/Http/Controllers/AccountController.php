<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

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
}

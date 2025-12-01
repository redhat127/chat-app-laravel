<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class ChatRoomController extends Controller
{
    public function createRoom()
    {
        return inertia('room/create');
    }

    public function createRoomPost()
    {
        $validated = request()->validate([
            'name' => ['bail', 'required', 'string', 'min:1', 'max:50', 'regex:/^[A-Za-z0-9 _-]+$/'],
            'is_public' => ['bail', 'required', 'boolean'],
        ]);

        Auth::user()->rooms()->create($validated);

        $text = 'Chat room '.'"'.str($validated['name'])->limit(preserveWords: true).'"'.' created.';

        return redirect()->route('home')
            ->with('flashMessage', [
                'type' => 'success',
                'text' => $text,
            ]);
    }
}

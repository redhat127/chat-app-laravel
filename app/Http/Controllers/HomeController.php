<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user();

        return inertia('home', [
            'publicRooms' => inertia()->defer(fn() => $currentUser ? ChatRoom::latest()
                ->public()
                ->withCount('members')
                ->get()
                ->toResourceCollection() : null, 'publicRooms'),
            'joinedRooms' => inertia()->defer(fn() => $currentUser ? $currentUser
                ->rooms()
                ->latest()
                ->withCount('members')
                ->get()
                ->toResourceCollection() : null, 'joinedRooms'),
        ]);
    }
}

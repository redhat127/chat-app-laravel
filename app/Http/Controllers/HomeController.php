<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        return inertia('home', [
            'publicRooms' => inertia()->defer(fn () => Auth::id() ? ChatRoom::latest()
                ->where('is_public', true)
                ->withCount('members')
                ->get()
                ->toResourceCollection() : null, 'publicRooms'),
            'joinedRooms' => inertia()->defer(fn () => Auth::id() ? Auth::user()
                ->rooms()
                ->latest()
                ->withCount('members')
                ->get()
                ->toResourceCollection() : null, 'joinedRooms'),
        ]);
    }
}

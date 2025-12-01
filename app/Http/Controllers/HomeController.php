<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $rooms = ['data' => []];

        if (Auth::id()) {
            $rooms = Auth::user()->rooms()->latest()->get()->toResourceCollection();
        }

        return inertia('home', compact('rooms'));
    }
}

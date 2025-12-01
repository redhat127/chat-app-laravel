<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
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

        $newRoom = Auth::user()->ownedRooms()->create($validated);

        $currentUserId = Auth::id();

        $newRoom->members()->attach([$currentUserId]);

        $text = 'Chat room '.'"'.str($validated['name'])->limit(preserveWords: true).'"'.' created.';

        return redirect()->route('home')
            ->with('flashMessage', [
                'type' => 'success',
                'text' => $text,
            ]);
    }

    public function joinRoom()
    {
        $roomId = request()->validate([
            'roomId' => ['bail', 'required', 'string', 'ulid'],
        ])['roomId'];

        $room = ChatRoom::find($roomId);

        if (! $room) {
            return back()->with('flashMessage', ['type' => 'error', 'text' => 'Room not found.']);
        }

        if (! $room->is_public) {
            return back()->with('flashMessage', ['type' => 'error', 'text' => 'You cannot join a private room.']);
        }

        $currentUserId = Auth::id();

        if ($room->user_id === $currentUserId) {
            return back()->with('flashMessage', [
                'type' => 'error',
                'text' => 'You cannot join a room you created.',
            ]);
        }

        if ($room->members()->where('member_id', $currentUserId)->exists()) {
            return back()->with('flashMessage', ['type' => 'error', 'text' => 'You are already a member of this room.']);
        }

        $room->members()->attach($currentUserId);

        return redirect()->route('room.show', ['roomId' => $room->id])
            ->with('flashMessage', [
                'type' => 'success',
                'text' => 'You have successfully joined the room "'.str($room->name)->limit(preserveWords: true).'".',
            ]);
    }

    public function leaveRoom()
    {
        $roomId = request()->validate([
            'roomId' => ['bail', 'required', 'string', 'ulid'],
        ])['roomId'];

        $room = ChatRoom::find($roomId);

        if (! $room) {
            return back()->with('flashMessage', ['type' => 'error', 'text' => 'Room not found.']);
        }

        $currentUserId = Auth::id();

        if ($room->user_id === $currentUserId) {
            return back()->with('flashMessage', [
                'type' => 'error',
                'text' => 'You cannot leave a room you created.',
            ]);
        }

        if (! $room->members()->where('member_id', $currentUserId)->exists()) {
            return back()->with('flashMessage', ['type' => 'error', 'text' => 'You are not a member of this room.']);
        }

        $room->members()->detach($currentUserId);

        return back()->with('flashMessage', [
            'type' => 'success',
            'text' => 'You have successfully left the room "'.str($room->name)->limit(preserveWords: true).'".',
        ]);
    }

    public function show(string $roomId)
    {
        $room = ChatRoom::query()
            ->whereKey($roomId)
            ->public()
            ->withCount('members')
            ->firstOrFail();

        $currentUserId = Auth::id();

        $isCurrentUserMember = $room->members()
            ->where('member_id', $currentUserId)
            ->exists();

        $isRoomCreator = $room->user_id === $currentUserId;

        return inertia('room/show', [
            'room' => $room->toResource(),
            'isCurrentUserMember' => $isCurrentUserMember,
            'isRoomCreator' => $isRoomCreator,
        ]);
    }
}

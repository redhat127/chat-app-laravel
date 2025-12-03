<?php

use App\Models\ChatRoom;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;

Broadcast::channel('room.{roomId}', function ($user, string $roomId) {
    $room = ChatRoom::query()->public()->find($roomId);

    if (! $room) {
        return false;
    }

    return true;
});

Broadcast::channel('room.{roomId}.user-id', function ($user, string $roomId) {
    $currentUserExistsAsMember = DB::table('chat_room_member')
        ->where('chat_room_id', $roomId)
        ->where('member_id', $user->id)
        ->exists();

    return [
        'user_id' => $user->id,
        'current_user_exists_as_member' => $currentUserExistsAsMember,
    ];
});

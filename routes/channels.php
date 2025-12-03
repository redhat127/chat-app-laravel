<?php

use App\Models\ChatRoom;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('room.{roomId}', function ($user, string $roomId) {
    $room = ChatRoom::query()->public()->find($roomId);

    if (! $room) {
        return false;
    }

    return true;
});

<?php

namespace App\Http\Controllers;

use App\Events\BroadcastMessageEvent;
use App\Http\Resources\MessageResource;
use App\Models\ChatRoom;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function post(string $roomId)
    {
        $validated = request()->validate([
            'text' => ['bail', 'required', 'string', 'min:1', 'max:160'],
        ]);

        $room = ChatRoom::find($roomId);

        if (! $room) {
            return response()->json([
                'flashMessage' => ['type' => 'error', 'text' => 'Room not found.'],
            ], 404);
        }

        if (! $room->is_public) {
            return response()->json([
                'flashMessage' => ['type' => 'error', 'text' => 'You cannot send messages in private rooms.'],
            ], 403);
        }

        $currentUser = Auth::user();

        if (! $room->members()->where('member_id', $currentUser->id)->exists()) {
            return response()->json([
                'flashMessage' => ['type' => 'error', 'text' => 'You are not a member of this room.'],
            ], 400);
        }

        $message = $room->messages()->create([
            'text' => $validated['text'],
            'chat_room_id' => $room->id,
            'user_id' => $currentUser->id,
        ]);

        $message->setRelations(['user' => $currentUser]);

        $new_message = new MessageResource($message);

        broadcast(new BroadcastMessageEvent($room->id, $new_message))->toOthers();

        return response()->json(compact('new_message'));
    }
}

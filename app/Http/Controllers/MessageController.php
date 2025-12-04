<?php

namespace App\Http\Controllers;

use App\Events\BroadcastMessageEvent;
use App\Http\Resources\MessageResource;
use App\Models\ChatRoom;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class MessageController extends Controller
{
    public function index(string $roomId)
    {
        $validator = Validator::make([
            'roomId' => $roomId,
        ], [
            'roomId' => [
                'bail',
                'required',
                'string',
                'ulid',
            ],
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages([
                'roomId' => $validator->errors()->first('roomId'),
            ]);
        }

        $roomId = $validator->safe()->only(['roomId'])['roomId'];

        $messages = Message::where('chat_room_id', $roomId)
            ->latest()
            ->with('user:id,name,avatar')
            ->cursorPaginate(10)
            ->toResourceCollection();

        return response()->json([
            'messages' => $messages,
            'next_cursor' => $messages->nextCursor()?->encode(),
        ]);
    }

    public function post(string $roomId)
    {
        $validator = Validator::make([
            'text' => request()->input('text'),
        ], [
            'text' => ['bail', 'required', 'string', 'min:1', 'max:160'],
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages([
                'text' => $validator->errors()->first('text'),
            ]);
        }

        $text = $validator->safe()->only(['text'])['text'];

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
            'text' => $text,
            'chat_room_id' => $room->id,
            'user_id' => $currentUser->id,
        ]);

        $message->setRelations(['user' => $currentUser]);

        $new_message = new MessageResource($message);

        broadcast(new BroadcastMessageEvent($room->id, $new_message))->toOthers();

        return response()->json(compact('new_message'));
    }
}

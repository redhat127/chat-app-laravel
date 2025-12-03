<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...$this->only([
                'id',
                'text',
                'chat_room_id',
                'user_id',
                'created_at',
                'updated_at',
            ]),
            'is_mine' => $this->user_id === Auth::id(),
            'user' => $this->whenLoaded('user', fn () => $this->user->only(['id', 'name'])),
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatRoomResource extends JsonResource
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
                'name',
                'is_public',
                'created_at',
                'updated_at',
                'user_id',
            ]),
            'members_count' => $this->whenCounted('members'),
        ];
    }
}

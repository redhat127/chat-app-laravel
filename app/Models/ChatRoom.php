<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    /** @use HasFactory<\Database\Factories\ChatRoomFactory> */
    use HasFactory, HasUlids;

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'chat_room_member', 'chat_room_id', 'member_id')
            ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }
}

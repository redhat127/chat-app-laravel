<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\ChatRoom;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $saeid = User::factory()->create([
            'name' => 'saeid',
            'email' => 'saeid@example.com',
            'password' => Hash::make('password123456'),
            'provider_name' => 'test',
        ]);

        $redhat = User::factory()->create([
            'name' => 'redhat',
            'email' => 'saeid.ebrahimi127@gmail.com',
            'password' => Hash::make('password123456'),
            'provider_name' => 'github',
            'avatar' => 'https://avatars.githubusercontent.com/u/149868560?v=4',
        ]);

        $testChatRoom = ChatRoom::factory()->create([
            'name' => 'test',
            'user_id' => $saeid->id,
        ]);

        $testChatRoom->members()->attach([
            $saeid->id,
            $redhat->id,
        ]);

        Message::factory()
            ->count(50)
            ->sequence(
                // Saeid
                fn (Sequence $seq) => [
                    'user_id' => $saeid->id,
                    'created_at' => now()->subMinutes(200)->addMinutes($seq->index),
                    'updated_at' => now()->subMinutes(200)->addMinutes($seq->index),
                ],
                // Redhat
                fn (Sequence $seq) => [
                    'user_id' => $redhat->id,
                    'created_at' => now()->subMinutes(200)->addMinutes($seq->index),
                    'updated_at' => now()->subMinutes(200)->addMinutes($seq->index),
                ],
            )
            ->create([
                'chat_room_id' => $testChatRoom->id,
            ]);
    }
}

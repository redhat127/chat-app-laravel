<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_room_member', function (Blueprint $table) {
            $table->foreignUlid('chat_room_id')->constrained()
                ->cascadeOnDelete();
            $table->foreignUlid('member_id')->constrained('users', 'id')
                ->cascadeOnDelete();
            $table->primary(['chat_room_id', 'member_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_room_member');
    }
};

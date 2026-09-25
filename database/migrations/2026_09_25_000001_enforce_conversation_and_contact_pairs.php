<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Refuse ambiguous legacy data before changing the schema. Silently merging
        // conversations could destroy message history or change contact acceptance.
        foreach (['chat_rooms' => ['sender_id', 'receiver_id'], 'friendships' => ['requester_id', 'user_id']] as $table => [$left, $right]) {
            $seen = [];
            foreach (DB::table($table)->orderBy('id')->cursor() as $row) {
                $key = min($row->$left, $row->$right).':'.max($row->$left, $row->$right);
                if (isset($seen[$key])) {
                    throw new RuntimeException("Duplicate pairs in {$table}; back up and consolidate these records before migrating.");
                }
                $seen[$key] = true;
            }
        }

        foreach (['chat_rooms' => ['sender_id', 'receiver_id'], 'friendships' => ['requester_id', 'user_id']] as $table => [$left, $right]) {
            Schema::table($table, fn (Blueprint $schema) => $schema->string('pair_key', 45)->nullable()->unique());
            DB::table($table)->orderBy('id')->chunkById(500, function ($rows) use ($table, $left, $right) {
                foreach ($rows as $row) {
                    DB::table($table)->where('id', $row->id)->update([
                        'pair_key' => min($row->$left, $row->$right).':'.max($row->$left, $row->$right),
                    ]);
                }
            });
        }

        Schema::table('chat_room_messages', function (Blueprint $table) {
            $table->uuid('client_id')->nullable();
            $table->unique(['chat_room_id', 'sender_id', 'client_id'], 'messages_client_id');
            $table->index(['chat_room_id', 'id'], 'messages_room_cursor');
            $table->index(['receiver_id', 'viewed_at'], 'messages_unread');
        });
    }

    public function down(): void
    {
        Schema::table('chat_room_messages', function (Blueprint $table) {
            $table->dropUnique('messages_client_id');
            $table->dropColumn('client_id');
            $table->dropIndex('messages_room_cursor');
            $table->dropIndex('messages_unread');
        });
        foreach (['chat_rooms', 'friendships'] as $table) {
            Schema::table($table, function (Blueprint $schema) use ($table) {
                $schema->dropUnique($table.'_pair_key_unique');
                $schema->dropColumn('pair_key');
            });
        }
    }
};

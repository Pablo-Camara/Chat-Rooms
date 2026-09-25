<?php

namespace Tests\Feature;

use App\Events\ChatMessageSent;
use App\Models\User;
use App\Services\ChatRoomService;
use Illuminate\Contracts\Broadcasting\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\TestCase;

class ConversationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_read_the_directory_or_conversations(): void
    {
        $this->getJson('/api/users')->assertUnauthorized();
        $this->getJson('/api/conversations')->assertUnauthorized();
    }

    public function test_reopening_a_pair_in_either_direction_reuses_the_room(): void
    {
        [$alice, $bob] = User::factory()->count(2)->create();
        $id = $this->actingAs($alice)->postJson('/api/conversations', ['user_id' => $bob->id])->assertOk()->json('id');
        $this->actingAs($bob)->postJson('/api/conversations', ['user_id' => $alice->id])->assertOk()->assertJsonPath('id', $id);
        $this->assertDatabaseCount('chat_rooms', 1);
        $this->actingAs($alice)->postJson('/api/conversations', ['user_id' => $alice->id])->assertUnprocessable();
        $this->postJson('/api/conversations', ['user_id' => 999999])->assertUnprocessable();
    }

    public function test_only_participants_can_read_send_and_mark_messages_read(): void
    {
        [$alice, $bob, $outsider] = User::factory()->count(3)->create();
        $room = app(ChatRoomService::class)->between($alice, $bob);
        $this->actingAs($outsider)->getJson("/api/conversations/{$room->id}/messages")->assertForbidden();
        $this->postJson("/api/conversations/{$room->id}/messages", ['body' => 'Intrusion', 'client_id' => (string) Str::uuid()])->assertForbidden();
        $this->postJson("/api/conversations/{$room->id}/read", ['through_id' => 999])->assertForbidden();
        $this->getJson('/api/conversations')->assertJsonCount(0, 'data');
    }

    public function test_message_retries_are_idempotent_and_payloads_do_not_leak_credentials(): void
    {
        Event::fake([ChatMessageSent::class]);
        [$alice, $bob] = User::factory()->count(2)->create();
        $room = app(ChatRoomService::class)->between($alice, $bob);
        $payload = ['body' => '<script>alert(1)</script>', 'client_id' => (string) Str::uuid()];
        $sent = $this->actingAs($alice)->postJson("/api/conversations/{$room->id}/messages", $payload)->assertCreated();
        $this->postJson("/api/conversations/{$room->id}/messages", $payload)->assertOk()->assertJsonPath('data.id', $sent->json('data.id'));
        $this->assertDatabaseCount('chat_room_messages', 1);
        Event::assertDispatchedTimes(ChatMessageSent::class, 1);
        $sent->assertJsonPath('data.body', $payload['body'])->assertJsonMissingPath('data.password');
        $this->getJson('/api/conversations')->assertJsonMissingPath('data.0.person.password')->assertJsonMissingPath('data.0.password');
    }

    public function test_messages_are_bounded_validated_and_paginate_without_overlap(): void
    {
        [$alice, $bob] = User::factory()->count(2)->create();
        $room = app(ChatRoomService::class)->between($alice, $bob);
        $this->actingAs($alice)->postJson("/api/conversations/{$room->id}/messages", ['body' => '   ', 'client_id' => (string) Str::uuid()])->assertUnprocessable();
        $this->postJson("/api/conversations/{$room->id}/messages", ['body' => str_repeat('a', 256), 'client_id' => (string) Str::uuid()])->assertUnprocessable();
        for ($i = 0; $i < 55; $i++) {
            $room->messages()->create(['message' => "Message {$i}", 'sender_id' => $alice->id, 'receiver_id' => $bob->id]);
        }
        $first = $this->getJson("/api/conversations/{$room->id}/messages")->assertOk()->assertJsonCount(50, 'data')->assertJsonPath('has_more', true);
        $before = $first->json('data.0.id');
        $this->getJson("/api/conversations/{$room->id}/messages?before={$before}")->assertJsonCount(5, 'data')->assertJsonPath('has_more', false);
        $this->assertDatabaseCount('chat_room_messages', 55);
    }

    public function test_reads_only_mark_the_recipient_messages_through_the_visible_cursor(): void
    {
        [$alice, $bob] = User::factory()->count(2)->create();
        $room = app(ChatRoomService::class)->between($alice, $bob);
        $first = $room->messages()->create(['message' => 'First', 'sender_id' => $alice->id, 'receiver_id' => $bob->id]);
        $later = $room->messages()->create(['message' => 'Later', 'sender_id' => $alice->id, 'receiver_id' => $bob->id]);
        $this->actingAs($alice)->postJson("/api/conversations/{$room->id}/read", ['through_id' => $later->id])->assertNoContent();
        $this->assertNull($first->fresh()->viewed_at);
        $this->actingAs($bob)->postJson("/api/conversations/{$room->id}/read", ['through_id' => $first->id])->assertNoContent();
        $this->assertNotNull($first->fresh()->viewed_at);
        $this->assertNull($later->fresh()->viewed_at);
    }

    public function test_websocket_channel_authorization_rejects_outsiders(): void
    {
        [$alice, $bob, $outsider] = User::factory()->count(3)->create();
        $room = app(ChatRoomService::class)->between($alice, $bob);
        config(['broadcasting.default' => 'reverb']);
        app(Factory::class)->forgetDrivers();
        require base_path('routes/channels.php');
        $payload = ['channel_name' => 'private-chatRoom.'.$room->id, 'socket_id' => '123.456'];
        $this->actingAs($outsider)->postJson('/broadcasting/auth', $payload)->assertForbidden();
        $this->actingAs($alice)->postJson('/broadcasting/auth', $payload)->assertOk();
    }
}

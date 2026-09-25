<?php

namespace Tests\Feature;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AccountAndContactsTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_hashes_password_and_does_not_issue_a_browser_token(): void
    {
        $this->postJson('/api/register', [
            'firstName' => 'Ana Maria', 'lastName' => 'Silva', 'username' => 'ana',
            'password' => 'a-long-test-password', 'password_confirmation' => 'a-long-test-password',
        ])->assertCreated()->assertJsonPath('data.username', 'ana')->assertJsonMissingPath('token');
        $user = User::first();
        $this->assertNotSame('a-long-test-password', $user->password);
        $this->assertAuthenticatedAs($user);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_repeat_login_and_logout_work_with_cookie_authentication(): void
    {
        $user = User::factory()->create(['username' => 'tester']);
        $this->postJson('/api/login', ['username' => 'tester', 'password' => 'wrong'])->assertUnprocessable();
        for ($i = 0; $i < 2; $i++) {
            $this->postJson('/api/login', ['username' => 'tester', 'password' => 'test-password-123'])->assertOk()->assertJsonPath('data.id', $user->id);
            $this->assertAuthenticatedAs($user);
            $this->postJson('/api/logout')->assertNoContent();
            $this->assertGuest();
        }
    }

    public function test_browser_authentication_rejects_requests_without_csrf_protection(): void
    {
        $this->app['env'] = 'local';
        $this->postJson('/api/login', ['username' => 'tester', 'password' => 'test-password-123'])->assertStatus(419);
    }

    public function test_legacy_bearer_tokens_cannot_authenticate_browser_routes(): void
    {
        $user = User::factory()->create();
        DB::table('personal_access_tokens')->insert([
            'tokenable_type' => User::class, 'tokenable_id' => $user->id,
            'name' => 'auth', 'token' => hash('sha256', 'old-token'),
            'abilities' => '["*"]',
        ]);
        $this->withToken('old-token')->getJson('/api/me')->assertUnauthorized();
    }

    public function test_weak_passwords_are_rejected(): void
    {
        $this->postJson('/api/register', ['firstName' => 'Ana', 'lastName' => 'Silva', 'username' => 'ana', 'password' => 'short', 'password_confirmation' => 'short'])->assertUnprocessable();
        $this->assertDatabaseCount('users', 0);
    }

    public function test_login_attempts_are_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', ['username' => 'limited', 'password' => 'incorrect'])->assertUnprocessable();
        }
        $this->postJson('/api/login', ['username' => 'limited', 'password' => 'incorrect'])->assertStatus(429);
    }

    public function test_contact_requests_are_unique_and_only_the_recipient_can_accept(): void
    {
        [$alice, $bob, $outsider] = User::factory()->count(3)->create();
        $id = $this->actingAs($alice)->postJson("/api/friendships/{$bob->id}")->assertCreated()->json('id');
        $this->postJson("/api/friendships/{$bob->id}")->assertOk();
        $this->actingAs($bob)->postJson("/api/friendships/{$alice->id}")->assertOk();
        $this->assertDatabaseCount('friendships', 1);
        $this->actingAs($alice)->putJson("/api/friendships/{$id}")->assertForbidden();
        $this->actingAs($outsider)->deleteJson("/api/friendships/{$id}")->assertForbidden();
        $this->actingAs($bob)->putJson("/api/friendships/{$id}")->assertNoContent();
        $this->assertNotNull(Friendship::find($id)->accepted_at);
        $this->actingAs($alice)->deleteJson("/api/friendships/{$id}")->assertNoContent();
    }

    public function test_directory_is_paginated_and_treats_wildcards_as_literal_text(): void
    {
        $alice = User::factory()->create();
        User::factory()->count(23)->create();
        $this->actingAs($alice)->getJson('/api/users')->assertJsonCount(20, 'data')->assertJsonMissing(['username' => $alice->username]);
        $this->getJson('/api/users?page=2')->assertJsonCount(3, 'data');
        $this->getJson('/api/users?search=%25')->assertJsonCount(0, 'data');
        $this->getJson('/api/users?search=%27%20OR%201%3D1')->assertJsonCount(0, 'data');
    }
}

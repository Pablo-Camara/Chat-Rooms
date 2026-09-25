<?php

namespace Database\Seeders;

use App\Models\Friendship;
use App\Models\User;
use App\Services\ChatRoomService;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment(['local', 'testing'])) {
            throw new \RuntimeException('Demo accounts may only be created locally or in tests.');
        }
        if (User::exists()) {
            throw new \RuntimeException('Demo seeding requires an empty database; existing accounts were left untouched.');
        }

        $people = collect([
            ['Alex', 'Morgan', 'alex'], ['Sofia', 'Costa', 'sofia'],
            ['Jules', 'Park', 'jules'], ['Leo', 'Martins', 'leo'], ['Nora', 'Reed', 'nora'],
        ])->map(fn ($person) => User::create([
            'firstName' => $person[0], 'lastName' => $person[1], 'username' => $person[2],
            'password' => 'hello-there-demo',
        ]));

        $alex = $people[0];
        foreach ($people->skip(1) as $index => $person) {
            $room = app(ChatRoomService::class)->between($alex, $person);
            Friendship::create([
                'pair_key' => min($alex->id, $person->id).':'.max($alex->id, $person->id),
                'requester_id' => $person->id, 'user_id' => $alex->id,
                'accepted_at' => $index < 3 ? now()->subDays(5) : null,
                'accepted_at_date' => $index < 3 ? today()->subDays(5) : null,
            ]);
            $dialogue = $index === 1 ? [
                [false, 'Hey Alex! I took a walk by the river this morning. Found the little bookshop you mentioned.'],
                [true, 'The one with the green door? I could spend hours in there.'],
                [false, 'That’s the one. Picked up a collection of short stories and stayed for the coffee.'],
                [true, 'A very good way to spend a morning. What are you reading first?'],
                [false, 'The first story is set in Lisbon. Felt like a good place to start. ☀'],
                [true, 'Save me a recommendation when you finish it.'],
                [false, 'Deal. Same time next Saturday?'],
            ] : [[false, match ($index) {
                2 => 'I found that playlist we were talking about.', 3 => 'Coffee next week? My treat this time.', default => 'Hello! Nice to find you here.'
            }]];
            foreach ($dialogue as $offset => [$own, $body]) {
                $room->messages()->create([
                    'sender_id' => $own ? $alex->id : $person->id,
                    'receiver_id' => $own ? $person->id : $alex->id,
                    'message' => $body,
                    'viewed_at' => $offset < count($dialogue) - 1 ? now()->subMinutes(15 - $offset) : null,
                ]);
            }
        }
    }
}

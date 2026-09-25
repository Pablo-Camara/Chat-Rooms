<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<User> */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'firstName' => fake()->firstName(),
            'lastName' => fake()->lastName(),
            'username' => fake()->unique()->userName(),
            'password' => 'test-password-123',
        ];
    }
}

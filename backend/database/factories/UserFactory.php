<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'names' => fake()->firstName(),
            'surnames' => fake()->lastName(),
            'document_number' => fake()->unique()->randomNumber(7, true),
            'document_type_id' => fake()->numberBetween(1, 2),
            'nationality' => 'VENEZOLANO',
            'gender_id' => 1,
            'phone_operator_id' => fake()->numberBetween(1, 5),
            'phone_number' => fake()->unique()->randomNumber(7, true),
            'address' => 'Calle 1',
            'status_id' => 1,
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}

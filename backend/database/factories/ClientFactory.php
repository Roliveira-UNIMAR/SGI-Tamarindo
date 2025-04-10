<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ClientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'names' => fake()->firstName(),
            'surnames' => fake()->lastName(),
            'document_number' => fake()->unique()->randomNumber(7, true),
            'document_type_id' => fake()->numberBetween(1, 4) == 3 ? 4 : fake()->numberBetween(1, 2),
            'nationality' => 'VENEZOLANO',
            'gender_id' => 1,
            'phone_operator_id' => fake()->numberBetween(1, 5),
            'phone_number' => fake()->unique()->randomNumber(7, true),
            'address' => 'Calle 1',
            'status_id' => 1,
            'email' => fake()->unique()->safeEmail(),
        ];
    }
}

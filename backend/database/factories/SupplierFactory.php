<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    protected $model = Supplier::class;

    public function definition()
    {
        return [
            'name' => fake()->company(),
            'email' => fake()->unique()->safeEmail(),
            'document_number' => fake()->unique()->randomNumber(7, true),
            'document_type_id' => fake()->numberBetween(1, 6) == 4 ? fake()->numberBetween(5, 6) : fake()->numberBetween(1, 3),
            'phone_operator_id' => 1,
            'phone_number' => fake()->unique()->randomNumber(7, true),
            'address' => 'Avenida 1',
            'status_id' => 1,
        ];
    }
}

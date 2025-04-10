<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\ConsumptionNote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsumptionNoteFactory extends Factory
{
    protected $model = ConsumptionNote::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'client_id' => fake()->numberBetween(1, 10),
            'issued_at' => null,
            'cancelled_at' => null,
            'address' => 'RESTAURANTE PISO 2',
            'discount' => 0,
            'status_id' => 7,
        ];
    }
}

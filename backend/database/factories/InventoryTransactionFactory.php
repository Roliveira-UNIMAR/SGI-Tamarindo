<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\InventoryTransaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryTransactionFactory extends Factory
{
    protected $model = InventoryTransaction::class;

    public function definition(): array
    {
        return [
            'inventory_id' => fake()->numberBetween(1, 5),
            'transaction_type' => $this->faker->randomElement(['Entrada', 'Salida', 'Ajuste']),
            'quantity' => $this->faker->randomFloat(3, -100, 100),
            'user_id' => 1,
            'transaction_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'notes' => $this->faker->sentence()
        ];
    }
}

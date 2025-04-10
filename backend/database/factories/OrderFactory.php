<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'user_id' => fake()->numberBetween(1, 3),
            'supplier_id' => fake()->numberBetween(1, 10),
            'ordered_at' => null,
            'received_at' => null,
            'status_id' => 7,
        ];
    }
}

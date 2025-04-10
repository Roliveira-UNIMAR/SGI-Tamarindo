<?php

namespace Database\Factories;

use App\Models\InventoryTransfer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryTransferFactory extends Factory
{
    protected $model = InventoryTransfer::class;

    public function definition(): array
    {
        return [
            'from_inventory_id' => 1,
            'to_inventory_id' => 2,
            'transferred_quantity' => fake()->numberBetween(1, 100),
            'user_id' => 1,
            'status_id' => 1,
        ];
    }
}

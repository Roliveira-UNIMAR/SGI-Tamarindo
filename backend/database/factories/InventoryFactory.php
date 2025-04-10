<?php

namespace Database\Factories;

use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryFactory extends Factory
{
    protected $model = Inventory::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'unit_id' => 1,
            'location_id' => 1,
            'available_quantity' => 20,
            'min_stock_level' => 5,
            'max_stock_level' => 50,
            'reorder_point' => 40,
            'requires_refrigeration' => fake()->boolean(),
            'status_id' => 1,
        ];
    }
}

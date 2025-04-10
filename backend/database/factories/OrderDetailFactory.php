<?php

namespace Database\Factories;

use App\Models\OrderDetail;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderDetailFactory extends Factory
{
    protected $model = OrderDetail::class;

    // Guardamos combinaciones ya generadas para evitar duplicados
    protected static array $existingCombinations = [];

    public function definition(): array
    {
        do {
            $orderId = fake()->numberBetween(1, 10);
            $productId = fake()->numberBetween(1, 10);
            $key = "$orderId-$productId";
        } while (in_array($key, self::$existingCombinations));

        // Guardamos la combinación para evitar repetirla
        self::$existingCombinations[] = $key;

        return [
            'order_id' => $orderId,
            'product_id' => $productId,
            'ordered_quantity' => fake()->numberBetween(1, 50),
            'received_quantity' => 0,
        ];
    }
}

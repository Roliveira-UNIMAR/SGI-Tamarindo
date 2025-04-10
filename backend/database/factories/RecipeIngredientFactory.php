<?php

namespace Database\Factories;

use App\Models\RecipeIngredient;
use Illuminate\Database\Eloquent\Factories\Factory;

class RecipeIngredientFactory extends Factory
{
    protected $model = RecipeIngredient::class;

    // Guardamos combinaciones ya generadas para evitar duplicados
    protected static array $existingCombinations = [];

    public function definition(): array
    {
        do {
            $recipeId = fake()->numberBetween(1, 10);
            $productId = fake()->numberBetween(1, 10);
            $key = "$recipeId-$productId";
        } while (in_array($key, self::$existingCombinations));

        // Guardamos la combinación para evitar repetirla
        self::$existingCombinations[] = $key;

        return [
            'recipe_id' => $recipeId,
            'product_id' => $productId,
            'quantity' => 1,
            'unit_id' => 1,
        ];
    }
}

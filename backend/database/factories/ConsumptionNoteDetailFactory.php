<?php

namespace Database\Factories;

use App\Models\ConsumptionNoteDetail;
use App\Models\Recipe;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConsumptionNoteDetailFactory extends Factory
{
    protected $model = ConsumptionNoteDetail::class;

    // Guardamos combinaciones ya generadas para evitar duplicados
    protected static array $existingCombinations = [];

    public function definition(): array
    {
        do {
            $consumptionNoteId = fake()->numberBetween(1, 9);
            $recipeId = fake()->numberBetween(1, 10);
            $key = "$consumptionNoteId-$recipeId";
        } while (in_array($key, self::$existingCombinations));

        // Guardamos la combinación para evitar repetirla
        self::$existingCombinations[] = $key;

        return [
            'consumption_note_id' => $consumptionNoteId,
            'recipe_id' => $recipeId,
            'quantity' => 5,
            'unit_price' => 10,
        ];
    }
}

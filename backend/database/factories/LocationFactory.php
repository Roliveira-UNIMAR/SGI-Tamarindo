<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'name' => 'Almacen General',
            'description' => fake()->sentence(),
            'address' => 'Habitacion almacen 2405',
            'is_refrigerated' => fake()->boolean(),
            'status_id' => 1,
        ];
    }
}

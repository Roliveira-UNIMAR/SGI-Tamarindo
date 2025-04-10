<?php

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    public function run()
    {
        $units = [
            ['name' => 'Gramo', 'abbreviation' => 'gr'],
            ['name' => 'Mililitro', 'abbreviation' => 'mL'],
            ['name' => 'Unidad', 'abbreviation' => 'und'],
            ['name' => 'Kilogramo', 'abbreviation' => 'kg'],
            ['name' => 'Litro', 'abbreviation' => 'L'],
            ['name' => 'Pieza', 'abbreviation' => 'pz'],
            ['name' => 'Taza', 'abbreviation' => 'tz'],
            ['name' => 'Cucharada', 'abbreviation' => 'cda'],
            ['name' => 'Cucharadita', 'abbreviation' => 'cdta'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate($unit);
        }
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductInventorySeeder extends Seeder
{
    public function run()
    {
        $products = [
            ['name' => 'Lechuga romana', 'description' => 'Lechuga fresca para ensaladas', 'unit_id' => 1],
            ['name' => 'Queso parmesano rallado', 'description' => 'Queso rallado para pastas', 'unit_id' => 1],
            ['name' => 'Crutones', 'description' => 'Pan tostado en cubos', 'unit_id' => 1],
            ['name' => 'Aderezo César', 'description' => 'Salsa especial para ensaladas', 'unit_id' => 2],
            ['name' => 'Pechuga de pollo', 'description' => 'Pechuga de pollo', 'unit_id' => 3],
            ['name' => 'Zanahoria', 'description' => 'Zanahoria fresca', 'unit_id' => 1],
            ['name' => 'Calabacín', 'description' => 'Calabacín fresco', 'unit_id' => 1],
            ['name' => 'Papa', 'description' => 'Papa fresca', 'unit_id' => 1],
            ['name' => 'Cebolla', 'description' => 'Cebolla blanca', 'unit_id' => 1],
            ['name' => 'Cebolla Morada', 'description' => 'Cebolla morado', 'unit_id' => 1],
            ['name' => 'Crema de leche', 'description' => 'Crema de leche líquida', 'unit_id' => 2],
            ['name' => 'Caldo de verduras', 'description' => 'Caldo base para sopas', 'unit_id' => 2],
            ['name' => 'Jugo de limón', 'description' => 'Jugo de limón natural', 'unit_id' => 2],
            ['name' => 'Cilantro fresco', 'description' => 'Cilantro para aderezar', 'unit_id' => 1],
            ['name' => 'Ají picante', 'description' => 'Ají picante fresco', 'unit_id' => 1],
            ['name' => 'Pargo fresco', 'description' => 'Pargo entero fresco', 'unit_id' => 1],
            ['name' => 'Ajo', 'description' => 'Ajo fresco', 'unit_id' => 1],
            ['name' => 'Aceite vegetal', 'description' => 'Aceite de cocina', 'unit_id' => 2],
            ['name' => 'Filete de pescado', 'description' => 'Filete de pescado sin espinas', 'unit_id' => 1],
            ['name' => 'Mantequilla', 'description' => 'Mantequilla sin sal', 'unit_id' => 1],
            ['name' => 'Lomito de res', 'description' => 'Corte de lomito fresco', 'unit_id' => 1],
            ['name' => 'Aceite de oliva', 'description' => 'Aceite de oliva extra virgen', 'unit_id' => 4],
            ['name' => 'Filete de res', 'description' => 'Corte de res para parrilla', 'unit_id' => 2],
            ['name' => 'Chorizo', 'description' => 'Chorizo para parrilla', 'unit_id' => 1],
            ['name' => 'Costilla de cerdo', 'description' => 'Costilla de cerdo fresca', 'unit_id' => 1],
            ['name' => 'Camarones', 'description' => 'Camarones frescos', 'unit_id' => 1],
            ['name' => 'Calamares', 'description' => 'Anillos de calamar', 'unit_id' => 1],
            ['name' => 'Romero fresco', 'description' => 'Hierba aromática', 'unit_id' => 1],
            ['name' => 'Champiñones frescos', 'description' => 'Champiñones naturales', 'unit_id' => 1],
            ['name' => 'Salsa de tomate', 'description' => 'Salsa de tomate natural', 'unit_id' => 2],
            ['name' => 'Pasta de tomate', 'description' => 'Pasta de tomate', 'unit_id' => 1],
            ['name' => 'Mayonesa', 'description' => 'Mayonesa', 'unit_id' => 1],
            ['name' => 'Pasta', 'description' => 'Pasta seca variada', 'unit_id' => 1],
            ['name' => 'Tocineta', 'description' => 'Tocineta ahumado', 'unit_id' => 1],
            ['name' => 'Huevo', 'description' => 'Huevo fresco', 'unit_id' => 3],
            ['name' => 'Albahaca fresca', 'description' => 'Hierba aromática fresca', 'unit_id' => 1],
            ['name' => 'Carne molida de res', 'description' => 'Carne de res molida', 'unit_id' => 1],
            ['name' => 'Mejillones', 'description' => 'Mejillones frescos', 'unit_id' => 1],
            ['name' => 'Pan de hamburguesa', 'description' => 'Pan suave para hamburguesa', 'unit_id' => 3],
            ['name' => 'Queso amarillo', 'description' => 'Queso amarillo en lonjas', 'unit_id' => 1],
            ['name' => 'Queso mozzarella', 'description' => 'Queso mozzarella', 'unit_id' => 1],
            ['name' => 'Queso Blanco Duro', 'description' => 'Queso Duro Blanco', 'unit_id' => 2],
            ['name' => 'Tomate', 'description' => 'Tomate rojo fresco', 'unit_id' => 1],
            ['name' => 'Pan de sándwich', 'description' => 'Pan blanco en rebanadas', 'unit_id' => 3],
            ['name' => 'Jamón', 'description' => 'Jamón de cerdo', 'unit_id' => 1],
            ['name' => 'Papas fritas', 'description' => 'Papas listas para freír', 'unit_id' => 3],
            ['name' => 'Masa de pizza', 'description' => 'Base de pizza precocida', 'unit_id' => 3],
            ['name' => 'Aceitunas', 'description' => 'Aceitunas negras en rodajas', 'unit_id' => 1],
            ['name' => 'Alcachofas', 'description' => 'Alcachofas en conserva', 'unit_id' => 1],
            ['name' => 'Harina de trigo', 'description' => 'Harina de trigo', 'unit_id' => 1],
            ['name' => 'Pan rallado', 'description' => 'Pan rallado', 'unit_id' => 1]
        ];

        foreach ($products as $product) {
            $productId = DB::table('products')->insertGetId([
                'name' => $product['name'],
                'description' => $product['description'],
                'unit_id' => $product['unit_id'],
                'status_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('inventories')->insert([
                'product_id' => $productId,
                'unit_id' => $product['unit_id'],
                'location_id' => 1,
                'available_quantity' => rand(10, 100),
                'min_stock_level' => 50,
                'max_stock_level' => 500,
                'reorder_point' => 20,
                'requires_refrigeration' => false,
                'status_id' => 1,
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Client;
use App\Models\ConsumptionNote;
use App\Models\ConsumptionNoteDetail;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use App\Models\InventoryTransfer;
use App\Models\Location;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\Role;
use App\Models\Status;
use App\Models\Supplier;
use App\Models\Unit;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        Status::create(['name' => 'Activo']);
        Status::create(['name' => 'Inactivo']);
        Status::create(['name' => 'Enviada']);
        Status::create(['name' => 'Recibida']);
        Status::create(['name' => 'Retrasada']);
        Status::create(['name' => 'Verificada']);
        Status::create(['name' => 'Pendiente']);
        Status::create(['name' => 'Anulada']);
        Status::create(['name' => 'Emitida']);
        Status::create(['name' => 'Cancelada']);

        Role::create(['name' => 'Superadministrador']);
        Role::create(['name' => 'Administrador']);
        Role::create(['name' => 'Jefe de Área']);
        Role::create(['name' => 'Asistente de Sala']);
        Role::create(['name' => 'Jefe de Sala']);
        Role::create(['name' => 'Asistente de Cocina']);
        Role::create(['name' => 'Jefe de Cocina']);
        Role::create(['name' => 'Cajero']);

        DB::insert('insert into document_types (`char`, name) values (?, ?)', ['V', 'VENEZOLANO']);
        DB::insert('insert into document_types (`char`, name) values (?, ?)', ['E', 'EXTANJERO']);
        DB::insert('insert into document_types (`char`, name) values (?, ?)', ['J', 'JURIDICO']);
        DB::insert('insert into document_types (`char`, name) values (?, ?)', ['P', 'PASAPORTE']);
        DB::insert('insert into document_types (`char`, name) values (?, ?)', ['G', 'GOBIERNO']);
        DB::insert('insert into document_types (`char`, name) values (?, ?)', ['C', 'CONSEJOS COMUNALES']);
        DB::insert('insert into genders (`char`, name) values (?, ?)', ['M', 'MASCULINO']);
        DB::insert('insert into genders (`char`, name) values (?, ?)', ['F', 'FEMENINO']);
        DB::insert('insert into phone_operators (code, name) values (?, ?)', ['0412', '(0412) DIGITEL']);
        DB::insert('insert into phone_operators (code, name) values (?, ?)', ['0414', '(0414) MOVISTAR']);
        DB::insert('insert into phone_operators (code, name) values (?, ?)', ['0424', '(0424) MOVISTAR']);
        DB::insert('insert into phone_operators (code, name) values (?, ?)', ['0416', '(0416) MOVILNET']);
        DB::insert('insert into phone_operators (code, name) values (?, ?)', ['0426', '(0426) MOVILNET']);
        DB::insert('insert into phone_operators (code, name) values (?, ?)', ['0295', '(0495) MARGARITA']);

        User::factory()->create([
            'names' => 'Test User',
            'email' => 'test@example.com',
            'role_id' => 2,
        ]);

        User::factory()->create([
            'names' => 'Admin',
            'email' => 'admin@admin.com',
            'role_id' => 1,
        ]);

        User::factory()->create([
            'names' => 'Jefe',
            'email' => 'jefe@admin.com',
            'role_id' => 3,
        ]);

        User::factory()->create([
            'names' => 'Mesonero',
            'email' => 'mesonero@admin.com',
            'role_id' => 4,
        ]);

        User::factory()->create([
            'names' => 'Jefe de Sala',
            'email' => 'sala@admin.com',
            'role_id' => 5,
        ]);

        User::factory()->create([
            'names' => 'Cocinero',
            'email' => 'cocinero@admin.com',
            'role_id' => 6,
        ]);

        User::factory()->create([
            'names' => 'Jefe de Cocina',
            'email' => 'cocina@admin.com',
            'role_id' => 7,
        ]);

        User::factory()->create([
            'names' => 'Cajero',
            'email' => 'cajero@admin.com',
            'role_id' => 8,
        ]);

        // User::factory(10)->create();

        Client::factory(10)->create();
        Supplier::factory(10)->create();
        Location::factory()->create();

        $units = [
            ['name' => 'Gramo', 'abbreviation' => 'gr'],
            ['name' => 'Mililitro', 'abbreviation' => 'mL'],
            ['name' => 'Unidad', 'abbreviation' => 'und'],
            ['name' => 'Kilogramo', 'abbreviation' => 'kg'],
            ['name' => 'Litro', 'abbreviation' => 'L'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate($unit);
        }

        $categories = [
            ['name' => 'Alimento', 'description' => 'Todo tipo de alimentos'],
            ['name' => 'Bebida', 'description' => 'Todo tipo de bebidas'],
            ['name' => 'Bebida Alcholica', 'description' => 'Bebidas Alcholicas'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $products = [
            ['name' => 'Lechuga romana', 'description' => 'Lechuga fresca para ensaladas', 'unit_id' => 1],
            ['name' => 'Queso parmesano rallado', 'description' => 'Queso rallado para pastas', 'unit_id' => 1],
            ['name' => 'Crutones', 'description' => 'Pan tostado en cubos', 'unit_id' => 1],
            ['name' => 'Aderezo César', 'description' => 'Salsa especial para ensaladas', 'unit_id' => 2],
            ['name' => 'Pechuga de pollo', 'description' => 'Pechuga de pollo', 'unit_id' => 1],
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
            ['name' => 'Aceite de oliva', 'description' => 'Aceite de oliva extra virgen', 'unit_id' => 2],
            ['name' => 'Filete de res', 'description' => 'Corte de res para parrilla', 'unit_id' => 1],
            ['name' => 'Chorizo', 'description' => 'Chorizo para parrilla', 'unit_id' => 1],
            ['name' => 'Costilla de cerdo', 'description' => 'Costilla de cerdo fresca', 'unit_id' => 1],
            ['name' => 'Camarones', 'description' => 'Camarones frescos', 'unit_id' => 1],
            ['name' => 'Calamares', 'description' => 'Anillos de calamar', 'unit_id' => 1],
            ['name' => 'Romero fresco', 'description' => 'Hierba aromática', 'unit_id' => 1],
            ['name' => 'Champiñones frescos', 'description' => 'Champiñones naturales', 'unit_id' => 1],
            ['name' => 'Salsa de tomate', 'description' => 'Salsa de tomate natural', 'unit_id' => 2],
            ['name' => 'Pasta de tomate', 'description' => 'Pasta de tomate', 'unit_id' => 2],
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
            ['name' => 'Queso Blanco Duro', 'description' => 'Queso Duro Blanco', 'unit_id' => 1],
            ['name' => 'Tomate', 'description' => 'Tomate rojo fresco', 'unit_id' => 1],
            ['name' => 'Pan de sándwich', 'description' => 'Pan blanco en rebanadas', 'unit_id' => 3],
            ['name' => 'Jamón', 'description' => 'Jamón de cerdo', 'unit_id' => 1],
            ['name' => 'Papas fritas', 'description' => 'Papas listas para freír', 'unit_id' => 1],
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

        DB::table('recipes')->insert([
            ['name' => 'Ensalada César Tradicional', 'description' => 'Ensalada clásica con aderezo César', 'price' => 7, 'category_id' => 1],
            ['name' => 'Ensalada César con Pollo', 'description' => 'Ensalada César con pollo a la plancha', 'price' => 10, 'category_id' => 1],
            ['name' => 'Crema de Vegetales', 'description' => 'Sopa cremosa de vegetales', 'price' => 7, 'category_id' => 1],
            ['name' => 'Sopa del Día', 'description' => 'Sopa especial del día', 'price' => 10, 'category_id' => 1],
            ['name' => 'Ceviche Clásico', 'description' => 'Ceviche de pescado fresco', 'price' => 12, 'category_id' => 1],
            ['name' => 'Pargo de Ración', 'description' => 'Pargo entero cocinado a la perfección', 'price' => 16, 'category_id' => 1],
            ['name' => 'Filete de Pescado', 'description' => 'Filete de pescado fresco', 'price' => 15, 'category_id' => 1],
            ['name' => 'Centro de Lomito', 'description' => 'Corte selecto de lomito', 'price' => 18, 'category_id' => 1],
            ['name' => 'Pechuga de Pollo a la Plancha', 'description' => 'Pechuga de pollo jugosa y dorada', 'price' => 14, 'category_id' => 1],
            ['name' => 'Parrilla Mixta x 2', 'description' => 'Parrilla variada para compartir', 'price' => 20, 'category_id' => 1],
            ['name' => 'Parrilla Mar y Tierra x 2', 'description' => 'Parrilla con carnes y mariscos', 'price' => 25, 'category_id' => 1],
            ['name' => 'Lomito al Romero', 'description' => 'Lomito sazonado con romero fresco', 'price' => 18, 'category_id' => 1],
            ['name' => 'Lomito en Salsa de Champiñones', 'description' => 'Carne en salsa cremosa de champiñones', 'price' => 18, 'category_id' => 1],
            ['name' => 'Carbonara', 'description' => 'Pasta con salsa cremosa y tocineta', 'price' => 12, 'category_id' => 1],
            ['name' => 'Alfredo', 'description' => 'Pasta con salsa blanca y queso parmesano', 'price' => 10, 'category_id' => 1],
            ['name' => 'Napoli', 'description' => 'Pasta con salsa de tomate natural', 'price' => 10, 'category_id' => 1],
            ['name' => 'Boloñesa', 'description' => 'Pasta con salsa de carne molida', 'price' => 12, 'category_id' => 1],
            ['name' => 'Marinera', 'description' => 'Pasta con mariscos frescos', 'price' => 17, 'category_id' => 1],
            ['name' => 'Pechuga de Pollo en Salsa de Champiñones', 'description' => 'Pechuga de pollo en salsa cremosa de champiñones', 'price' => 14, 'category_id' => 1],
            ['name' => 'Hamburguesa de Carne', 'description' => 'Hamburguesa casera con queso', 'price' => 15, 'category_id' => 1],
            ['name' => 'Club House', 'description' => 'Sándwich clásico con pollo y jamón', 'price' => 15, 'category_id' => 1],
            ['name' => 'Sándwich de Jamón y Queso con Papas Fritas', 'description' => 'Sándwich clásico con papas', 'price' => 10, 'category_id' => 1],
            ['name' => 'Papas Fritas', 'description' => 'Papas fritas doradas', 'price' => 5, 'category_id' => 1],
            ['name' => 'Pizza Margarita', 'description' => 'Pizza clásica con queso y albahaca', 'price' => 10, 'category_id' => 1],
            ['name' => 'Pizza 4 Estaciones', 'description' => 'Pizza con ingredientes variados', 'price' => 14, 'category_id' => 1],
            ['name' => 'Tequeños', 'description' => 'Deditos de queso crujientes', 'price' => 8, 'category_id' => 1],
            ['name' => 'Nugget de Pollo', 'description' => 'Nuggets caseros de pollo', 'price' => 12, 'category_id' => 1],
            ['name' => 'Dedos de Pescado', 'description' => 'Bastones de pescado empanizados', 'price' => 15, 'category_id' => 1],
            ['name' => 'Fosforera', 'description' => 'Sopa espesa de mariscos', 'price' => 15, 'category_id' => 1],
            ['name' => 'Cazuela de Mariscos', 'description' => 'Guiso de mariscos frescos', 'price' => 15, 'category_id' => 1],
        ]);

        ConsumptionNote::factory()->create();

        ConsumptionNoteDetail::factory()->create([
            'consumption_note_id' => 1,
            'recipe_id' => 2,
            'quantity' => 1,
            'unit_price' => Recipe::find(2)->price,
        ]);

        ConsumptionNoteDetail::factory()->create([
            'consumption_note_id' => 1,
            'recipe_id' => 4,
            'quantity' => 1,
            'unit_price' => Recipe::find(4)->price,
        ]);

        Order::factory()->create();

        OrderDetail::factory()->create([
            'order_id' => 1,
            'product_id' => 1,
            'ordered_quantity' => 1000,
        ]);

        OrderDetail::factory()->create([
            'order_id' => 1,
            'product_id' => 5,
            'ordered_quantity' => 1500,
        ]);
    }
}

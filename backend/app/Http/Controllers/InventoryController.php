<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener parámetros de búsqueda
            $productName = $request->query('product_name');
            $productId = $request->query('product_id');

            // Iniciar consulta segura
            $query = Inventory::query();

            // Si se proporciona un nombre de producto, aplicar filtro
            if (!empty($productName)) {
                $query->join('products', 'products.id', '=', 'inventories.product_id')
                    ->select('inventories.*', 'products.name as product_name')  // Selecciona explícitamente las columnas necesarias
                    ->where('products.name', 'like', '%' . $productName . '%'); // Filtro insensible a mayúsculas/minúsculas
            }

            if (!empty($productId)) {
                $query->where('inventories.product_id', $productId); // Aquí se asume que `product_id` está en `inventories`
            }

            // Obtener los datos filtrados
            $inventories = $query->get();

            // Retornar los datos en formato JSON
            return response()->json($inventories, 200);
        } catch (\Exception $e) {
            // En caso de error, retornar mensaje de error
            return response()->json(['error' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        $request['name'] =  ucfirst(strtolower($request->product_name));

        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:products,name',
                'description' => 'nullable|string',
                'unit_id' => 'required|exists:units,id',
            ], [
                'name.required' => 'El nombre es obligatorio.',
                'name.string' => 'El nombre debe ser una cadena de texto.',
                'name.max' => 'El nombre no debe exceder los 255 caracteres.',
                'name.unique' => 'El nombre ya está en uso.',
                'description.string' => 'La descripción debe ser una cadena de texto.',
                'unit_id.required' => 'El ID de la unidad es obligatorio.',
                'unit_id.exists' => 'El ID de la unidad seleccionada no es válido.',
            ]);

            if ($validator->fails()) {
                $errorMessages = collect(['Error de validación: '])
                    ->merge($validator->errors()->all())
                    ->toArray();

                return response()->json([
                    'message' => $errorMessages,
                ], 400);
            }

            // Retrieve the validated input...
            $validated = $validator->validated();

            $product = Product::create($validated);

            $request['product_id'] = $product->id;

            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'unit_id' => 'required|exists:units,id',
                'location_id' => 'required|exists:locations,id',
                'min_stock_level' => 'required|integer',
                'max_stock_level' => 'required|integer',
                'reorder_point' => 'required|integer',
                'requires_refrigeration' => 'required|boolean',
            ], [
                'product_id.required' => 'El ID del producto es obligatorio.',
                'product_id.exists' => 'El ID del producto seleccionado no es válido.',
                'unit_id.required' => 'El ID de la unidad es obligatorio.',
                'unit_id.exists' => 'El ID de la unidad seleccionada no es válido.',
                'location_id.required' => 'El ID de la ubicación es obligatorio.',
                'location_id.exists' => 'El ID de la ubicación seleccionada no es válido.',
                'min_stock_level.required' => 'El nivel mínimo de stock es obligatorio.',
                'min_stock_level.integer' => 'El nivel mínimo de stock debe ser un número entero.',
                'max_stock_level.required' => 'El nivel máximo de stock es obligatorio.',
                'max_stock_level.integer' => 'El nivel máximo de stock debe ser un número entero.',
                'reorder_point.required' => 'El punto de reorden es obligatorio.',
                'reorder_point.integer' => 'El punto de reorden debe ser un número entero.',
                'requires_refrigeration.required' => 'El campo de refrigeración es obligatorio.',
                'requires_refrigeration.boolean' => 'El campo de refrigeración debe ser verdadero o falso.',
            ]);

            if ($validator->fails()) {
                $data = [
                    'errors' => $validator->errors(),
                    'message' => 'Error durante la validación de datos.',
                ];
                return response()->json($data, 400);
            }

            // Retrieve the validated input...
            $validated = $validator->validated();

            $inventory = Inventory::create($validated);

            DB::commit();

            return response()->json($inventory, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error en el servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $inventory = Inventory::findOrFail($id);

        return response()->json($inventory);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'unit_id' => 'required|exists:units,id',
            'location_id' => 'required|exists:locations,id',
            'available_quantity' => 'required|integer',
            'min_stock_level' => 'required|integer',
            'max_stock_level' => 'required|integer',
            'reorder_point' => 'required|integer',
            'requires_refrigeration' => 'required|boolean',
        ], [
            'unit_id.required' => 'El ID de la unidad es obligatorio.',
            'unit_id.exists' => 'El ID de la unidad seleccionada no es válido.',
            'location_id.required' => 'El ID de la ubicación es obligatorio.',
            'location_id.exists' => 'El ID de la ubicación seleccionada no es válido.',
            'available_quantity.required' => 'La cantidad disponible es obligatoria.',
            'available_quantity.integer' => 'La cantidad disponible debe ser un número entero.',
            'min_stock_level.required' => 'El nivel mínimo de stock es obligatorio.',
            'min_stock_level.integer' => 'El nivel mínimo de stock debe ser un número entero.',
            'max_stock_level.required' => 'El nivel máximo de stock es obligatorio.',
            'max_stock_level.integer' => 'El nivel máximo de stock debe ser un número entero.',
            'reorder_point.required' => 'El punto de reorden es obligatorio.',
            'reorder_point.integer' => 'El punto de reorden debe ser un número entero.',
            'requires_refrigeration.required' => 'El campo de refrigeración es obligatorio.',
            'requires_refrigeration.boolean' => 'El campo de refrigeración debe ser verdadero o falso.',
        ]);

        if ($validator->fails()) {
            $errorMessages = collect(['Error de validación'])
                ->merge($validator->errors()->all())
                ->toArray();

            return response()->json([
                'message' => $errorMessages,
            ], 400);
        }

        // Retrieve the validated input...
        $validated = $validator->validated();

        DB::beginTransaction();


        try {
            $inventory = Inventory::findOrFail($id);
            $inventory->update($validated);

            if ($inventory) {
                $note = '';
                switch ($request->transaction_type) {
                    case 'entrada':
                        $inventory->available_quantity += $request->available_quantity;
                        $note = "Inventario Inicial";
                        break;
                    case 'salida':
                        $inventory->available_quantity -= $request->available_quantity;
                        $note = "Salida forzada";
                        break;
                    case 'ajuste':
                        $inventory->available_quantity = $request->available_quantity;
                        $note = "Ajuste";
                        break;
                }
                $inventory->save();

                if ($request->transaction_type !== "default") {
                    InventoryTransaction::create([
                        'inventory_id' => $id,
                        'transaction_type' => $request->transaction_type,
                        'quantity' => $request->available_quantity,
                        'user_id' => $request->user()->id,
                        'transaction_date' => now(),
                        'notes' => $request->concept ?? $note,
                    ]);
                }
            }

            DB::commit();

            return response()->json($inventory);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error en el servidor: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $inventory = Inventory::findOrFail($id);
        $inventory->status_id = 2;
        $inventory->update();

        // $inventory->delete();

        return response()->json(null, 204);
    }
}

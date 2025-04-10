<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InventoryTransfer;
use Illuminate\Support\Facades\Validator;

class InventoryTransferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return InventoryTransfer::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_inventory_id' => 'required|exists:inventories,id',
            'to_inventory_id' => 'required|exists:inventories,id',
            'transferred_quantity' => 'required|integer',
            'user_id' => 'required|exists:users,id',
        ], [
            'from_inventory_id.required' => 'El ID del inventario de origen es obligatorio.',
            'from_inventory_id.exists' => 'El ID del inventario de origen seleccionado no es válido.',
            'to_inventory_id.required' => 'El ID del inventario de destino es obligatorio.',
            'to_inventory_id.exists' => 'El ID del inventario de destino seleccionado no es válido.',
            'transferred_quantity.required' => 'La cantidad transferida es obligatoria.',
            'transferred_quantity.integer' => 'La cantidad transferida debe ser un número entero.',
            'user_id.required' => 'El ID del usuario es obligatorio.',
            'user_id.exists' => 'El ID del usuario seleccionado no es válido.',
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

        $inventoryTransfer = InventoryTransfer::create($validated);

        return response()->json($inventoryTransfer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $inventoryTransfer = InventoryTransfer::findOrFail($id);

        return response()->json($inventoryTransfer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'from_inventory_id' => 'required|exists:inventories,id',
            'to_inventory_id' => 'required|exists:inventories,id',
            'transferred_quantity' => 'required|integer',
            'user_id' => 'required|exists:users,id',
        ], [
            'from_inventory_id.required' => 'El ID del inventario de origen es obligatorio.',
            'from_inventory_id.exists' => 'El ID del inventario de origen seleccionado no es válido.',
            'to_inventory_id.required' => 'El ID del inventario de destino es obligatorio.',
            'to_inventory_id.exists' => 'El ID del inventario de destino seleccionado no es válido.',
            'transferred_quantity.required' => 'La cantidad transferida es obligatoria.',
            'transferred_quantity.integer' => 'La cantidad transferida debe ser un número entero.',
            'user_id.required' => 'El ID del usuario es obligatorio.',
            'user_id.exists' => 'El ID del usuario seleccionado no es válido.',
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

        $inventoryTransfer = InventoryTransfer::findOrFail($id);
        $inventoryTransfer->update($validated);

        return response()->json($inventoryTransfer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $inventoryTransfer = InventoryTransfer::findOrFail($id);
        $inventoryTransfer->status_id = 2;
        $inventoryTransfer->update();

        // $inventoryTransfer->delete();

        return response()->json(null, 204);
    }
}

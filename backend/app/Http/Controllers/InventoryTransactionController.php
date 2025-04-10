<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InventoryTransaction;
use App\Models\Inventory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InventoryTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = InventoryTransaction::with(['inventory', 'user']);

            // Filtros
            if ($request->has('transaction_type')) {
                $query->where('transaction_type', $request->transaction_type);
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('inventory_id')) {
                $query->where('inventory_id', $request->inventory_id);
            }

            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('transaction_date', [
                    $request->start_date,
                    $request->end_date
                ]);
            }

            $transactions = $query->orderBy('transaction_date', 'desc')->get();

            return response()->json($transactions, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener transacciones: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $user = $request->user();
        $request['user_id'] = $user->id;

        $validator = Validator::make($request->all(), [
            'transaction_type' => 'required|in:entrada,salida,ajuste',
            'user_id' => 'required|exists:users,id',
            'notes' => 'nullable|string|max:500',
            'products_details' => 'required|array',
            'products_details.*.product_id' => 'required|exists:products,id',
            'products_details.*.quantity' => 'required|integer|min:1',
        ], [
            'transaction_type.required' => 'El tipo de transacción es requerido',
            'transaction_type.in' => 'Tipo de transacción no válido',
            'user_id.required' => 'El usuario responsable es requerido',
            'user_id.exists' => 'Usuario no válido',
            'notes.max' => 'Las notas no deben exceder los 500 caracteres',
            'products_details.required' => 'Debe incluir al menos un detalle en el producto.',
            'products_details.array' => 'El formato de los detalles de el producto no es válido.',
            'products_details.*.product_id.required' => 'El detalle es obligatorio.',
            'products_details.*.product_id.exists' => 'El detalle seleccionado no es válido.',
            'products_details.*.quantity.required' => 'La cantidad es obligatorio.',
            'products_details.*.quantity.integer' => 'La cantidad debe ser un número entero.',
            'products_details.*.quantity.min' => 'La cantidad no puede ser negativa.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Error de validación en transacción'
            ], 400);
        }

        DB::beginTransaction();

        try {
            foreach ($request->products_details as $detail) {
                $inventory = Inventory::where('product_id', $detail['product_id'])->first();

                if ($inventory) {
                    switch ($request->transaction_type) {
                        case 'entrada':
                            $inventory->available_quantity += $detail['quantity'];
                            break;
                        case 'salida':
                            $inventory->available_quantity -= $detail['quantity'];
                            break;
                        case 'ajuste':
                            $inventory->available_quantity = $detail['quantity'];
                            break;
                    }
                    $inventory->save();

                    InventoryTransaction::create([
                        'inventory_id' => $inventory->id,
                        'transaction_type' => $request->transaction_type,
                        'quantity' => $detail['quantity'],
                        'user_id' => $request->user()->id,
                        'transaction_date' => now(),
                        'notes' => $request['notes'] ?? "Desperdicio",
                    ]);
                }
            }

            DB::commit();

            return response()->json("OK");
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
        try {
            $transaction = InventoryTransaction::with(['inventory', 'user'])
                ->findOrFail($id);

            return response()->json($transaction, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Transacción no encontrada'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'transaction_type' => 'sometimes|in:entrada,salida,ajuste',
            'quantity' => 'sometimes|numeric|not_in:0',
            'transaction_date' => 'sometimes|date',
            'notes' => 'nullable|string|max:500'
        ], [
            'transaction_type.in' => 'Tipo de transacción no válido',
            'quantity.numeric' => 'La cantidad debe ser numérica',
            'quantity.not_in' => 'La cantidad no puede ser cero',
            'transaction_date.date' => 'Formato de fecha inválido',
            'notes.max' => 'Las notas no deben exceder los 500 caracteres'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Error de validación en transacción'
            ], 400);
        }

        try {
            $transaction = InventoryTransaction::findOrFail($id);
            $originalData = $transaction->toArray();

            $transaction->update($validator->validated());

            // Si cambió cantidad o tipo, actualizar inventario
            if ($request->has('quantity') || $request->has('transaction_type')) {
                $inventory = $transaction->inventory;

                // Revertir transacción original
                switch ($originalData['transaction_type']) {
                    case 'entrada':
                        $inventory->available_quantity -= $originalData['quantity'];
                        break;
                    case 'salida':
                        $inventory->available_quantity += $originalData['quantity'];
                        break;
                    case 'ajuste':
                        // No se puede revertir un ajuste exacto
                        break;
                }

                // Aplicar nueva transacción
                switch ($transaction->transaction_type) {
                    case 'entrada':
                        $inventory->available_quantity += $transaction->quantity;
                        break;
                    case 'salida':
                        $inventory->available_quantity -= $transaction->quantity;
                        break;
                    case 'ajuste':
                        $inventory->available_quantity = $transaction->quantity;
                        break;
                }

                $inventory->save();
            }

            return response()->json($transaction->fresh(['inventory', 'user']), 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar transacción: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $transaction = InventoryTransaction::findOrFail($id);
            $inventory = $transaction->inventory;

            // Revertir transacción
            switch ($transaction->transaction_type) {
                case 'Entrada':
                    $inventory->available_quantity -= $transaction->quantity;
                    break;
                case 'Salida':
                    $inventory->available_quantity += $transaction->quantity;
                    break;
            }

            $inventory->save();
            $transaction->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar transacción: ' . $e->getMessage()
            ], 500);
        }
    }
}

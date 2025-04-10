<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use App\Models\Status;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener parámetros de búsqueda
            $supplierName = $request->query('supplier_name');
            $supplierDocument = $request->query('supplier_document');
            $userName = $request->query('user_name');
            $statusId = $request->query('status_id');

            // Iniciar consulta segura
            $query = Order::query();

            // Aplicar filtro por nombre de proveedor si existe
            if (!empty($supplierName)) {
                $query->join('suppliers', 'suppliers.id', '=', 'orders.supplier_id')  // Relación con proveedores
                    ->select('orders.*', 'suppliers.name as supplier_name') // Selecciona el nombre del proveedor
                    ->whereRaw('LOWER(suppliers.name) LIKE ?', ['%' . strtolower($supplierName) . '%']);
            }

            if (!empty($supplierDocument)) {
                $query->join('suppliers', 'suppliers.id', '=', 'orders.supplier_id')  // Relación con proveedores
                    ->select('orders.*', 'suppliers.document_number as supplier_document') // Selecciona el nombre del proveedor
                    ->whereRaw('LOWER(suppliers.document_number) LIKE ?', ['%' . strtolower($supplierDocument) . '%']);
            }

            // Aplicar filtro por nombre de usuario si existe
            if (!empty($userName)) {
                $query->join('users', 'users.id', '=', 'orders.user_id')  // Relación con usuarios
                    ->select('orders.*', 'users.names', 'users.surnames')  // Selecciona los nombres y apellidos del usuario
                    ->whereRaw('LOWER(CONCAT(users.names, " ", users.surnames)) LIKE ?', ['%' . strtolower($userName) . '%']);
            }

            // Aplicar filtro por status si existe
            if (!empty($statusId)) {
                $query->where('orders.status_id', $statusId); // Aquí se asume que `status_id` está en `orders`
            }

            // Obtener datos filtrados
            $orders = $query->where('orders.status_id', '!=', 2)->get();

            return response()->json($orders, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la consulta: ' . $e->getMessage()], 500);
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
            'user_id' => 'required|exists:users,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'ordered_at' => 'nullable|date',
            'received_at' => 'nullable|date',
            'status_id' => 'required|exists:statuses,id',
            'order_details' => 'required|array',
            'order_details.*.product_id' => 'required|exists:products,id',
            'order_details.*.ordered_quantity' => 'required|integer|min:0',
            'order_details.*.received_quantity' => 'nullable|integer|min:0',
        ], [
            'user_id.required' => 'El ID del usuario es obligatorio.',
            'user_id.exists' => 'El ID del usuario seleccionado no es válido.',
            'supplier_id.required' => 'El ID del proveedor es obligatorio.',
            'supplier_id.exists' => 'El ID del proveedor seleccionado no es válido.',
            'ordered_at.date' => 'La fecha de pedido debe ser una fecha válida.',
            'received_at.date' => 'La fecha de recepción debe ser una fecha válida.',
            'status_id.required' => 'El ID del estado es obligatorio.',
            'status_id.exists' => 'El ID del estado seleccionado no es válido.',
            'order_details.required' => 'Los detalles de la orden son requeridos.',
            'order_details.*.product_id.required' => 'El ID del producto es obligatorio.',
            'order_details.*.product_id.exists' => 'El ID del producto no es válido.',
            'order_details.*.ordered_quantity.required' => 'La cantidad ordenada es obligatoria.',
            'order_details.*.ordered_quantity.integer' => 'La cantidad ordenada debe ser un número entero.',
            'order_details.*.ordered_quantity.min' => 'La cantidad no puede ser negativa.',
            'order_details.*.received_quantity.integer' => 'La cantidad recibida debe ser un número entero.',
            'order_details.*.received_quantity.min' => 'La cantidad recibida no puede ser negativa.',
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

        $order = Order::create($validated);

        foreach ($validated['order_details'] as $detail) {
            $order->details()->create($detail);
        }

        return response()->json($order, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::findOrFail($id);

        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        $request['user_id'] = $user->id;

        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'supplier_id' => 'required|exists:suppliers,id',
                'ordered_at' => 'nullable|date',
                'received_at' => 'nullable|date',
                'status_id' => 'required|exists:statuses,id',
                'order_details' => 'required|array',
                'order_details.*.product_id' => 'required|exists:products,id',
                'order_details.*.ordered_quantity' => 'required|integer|min:0',
                'order_details.*.received_quantity' => 'nullable|integer|min:0',
            ], [
                'user_id.required' => 'El ID de usuario es obligatorio.',
                'user_id.exists' => 'El ID de usuario seleccionado no es válido.',
                'status_id.required' => 'El ID de estado es obligatorio.',
                'status_id.exists' => 'El ID de estado seleccionado no es válido.',
                'supplier_id.required' => 'El ID de proveedor es obligatorio.',
                'supplier_id.exists' => 'El ID de proveedor seleccionado no es válido.',
                'ordered_at.date' => 'La fecha de envío debe ser una fecha válida.',
                'received_at.date' => 'La fecha de recibido debe ser una fecha válida.',
                'order_details.*.ordered_quantity.integer' => 'La cantidad ordenada debe ser un número entero.',
                'order_details.*.received_quantity.integer' => 'La cantidad recibida debe ser un número entero.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors(),
                    'message' => 'Error de validación'
                ], 400);
            }

            $validated = $validator->validated();

            $order = Order::with('details')->findOrFail($id);
            $previousStatus = $order->status_id;

            // Actualizar detalles de la orden
            foreach ($validated['order_details'] as $detail) {
                $order->details()->updateOrCreate(
                    ['product_id' => $detail['product_id']],
                    [
                        'ordered_quantity' => $detail['ordered_quantity'],
                        'received_quantity' => $detail['received_quantity'] ?? 0 // Si es null, asignar 0
                    ]
                );
            }

            // Actualizar encabezado de la orden
            $order->update([
                'supplier_id' => $validated['supplier_id'],
                'ordered_at' => $validated['ordered_at'],
                'received_at' => $validated['received_at'],
                'status_id' => $validated['status_id']
            ]);

            // Refrescar la orden con los detalles actualizados
            $order->refresh();

            // Si la orden estaba en estado "Recibida", actualizar el inventario
            if ($previousStatus === 4) {
                foreach ($order->details as $detail) {
                    $inventory = Inventory::where('product_id', $detail->product_id)->first();

                    if ($inventory) {
                        $inventory->increment('available_quantity', $detail->received_quantity);

                        InventoryTransaction::create([
                            'inventory_id' => $inventory->id,
                            'transaction_type' => 'Entrada',
                            'quantity' => $detail->received_quantity,
                            'user_id' => $user->id,
                            'transaction_date' => now(),
                            'notes' => 'Orden Recibida: ' . $id
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json($order->load('details'));
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
        $order = Order::findOrFail($id);
        $order->status_id = 2;
        $order->update();

        // $order->delete();

        return response()->json(null, 204);
    }
}

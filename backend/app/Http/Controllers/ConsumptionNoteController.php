<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConsumptionNote;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use App\Models\Recipe;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ConsumptionNoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        try {
            // Obtener parámetros de búsqueda
            $clientDocument = $request->query('client_document');
            $statusId = $request->query('status_id');

            // Iniciar consulta
            $query = ConsumptionNote::query();

            // Aplicar filtro por status si existe
            if (!empty($statusId)) {
                $query->where('consumption_notes.status_id', '=', $statusId);  // Especificar de qué tabla proviene el status_id
            }

            // Aplicar filtro por documento si existe
            if (!empty($clientDocument)) {
                $query->join('clients', 'clients.id', '=', 'consumption_notes.client_id')
                    ->select('consumption_notes.*', 'clients.document_number')  // Selecciona explícitamente las columnas necesarias
                    ->whereRaw('LOWER(clients.document_number) LIKE ?', ['%' . strtolower($clientDocument) . '%']);
            }

            // Obtener datos filtrados
            $consumptionNotes = $query->where('consumption_notes.status_id', '!=', 2);

            if (!in_array($user->role_id, [1, 2, 8])) {
                $query->where('consumption_notes.user_id', $user->id);
            }

            if ($user->role_id === 8) {
                $query->where('consumption_notes.status_id', '!=', 7)
                    ->orderByRaw("FIELD(consumption_notes.status_id, 9, 10, 8)");
            }

            $consumptionNotes = $query->get();

            return response()->json($consumptionNotes, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $user = $request->user();
            $request['user_id'] = $user->id;

            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'client_id' => 'required|exists:clients,id',
                'issued_at' => 'nullable|date',
                'cancelled_at' => 'nullable|date',
                'address' => 'required|string|max:255',
                'discount' => 'nullable|integer',
                'status_id' => 'required|exists:statuses,id',
                'note_details' => 'required|array',
                'note_details.*.recipe_id' => 'required|exists:recipes,id',
                'note_details.*.unit_price' => 'required|decimal:0,2|min:1',
                'note_details.*.quantity' => 'required|integer|min:1',
            ], [
                'user_id.required' => 'El ID de usuario es obligatorio.',
                'user_id.exists' => 'El ID de usuario seleccionado no es válido.',
                'client_id.required' => 'El ID de cliente es obligatorio.',
                'client_id.exists' => 'El ID de cliente seleccionado no es válido.',
                'issued_at.date' => 'La fecha de emisión debe ser una fecha válida.',
                'cancelled_at.date' => 'La fecha de cancelación debe ser una fecha válida.',
                'address.required' => 'La dirección es obligatoria.',
                'address.string' => 'La dirección debe ser una cadena de texto.',
                'address.max' => 'La dirección no debe exceder los 255 caracteres.',
                'discount.integer' => 'El decuento debe ser un número entero.',
                'status_id.required' => 'El ID del estado es obligatorio.',
                'status_id.exists' => 'El ID del estado seleccionado no es válido.',
                'note_details.required' => 'Debe incluir al menos un receta en la orden.',
                'note_details.array' => 'El formato de los detalles de la orden no es válido.',
                'note_details.*.recipe_id.required' => 'El receta es obligatorio.',
                'note_details.*.recipe_id.exists' => 'El receta seleccionado no es válido.',
                'note_details.*.unit_price.required' => 'El precio unitario es obligatorio.',
                'note_details.*.unit_price.decimal' => 'El precio unitario debe ser un número decimal.',
                'note_details.*.unit_price.min' => 'El precio unitario debe ser al menos 1.',
                'note_details.*.quantity.required' => 'La cantidad es obligatorio.',
                'note_details.*.quantity.integer' => 'La cantidad debe ser un número entero.',
                'note_details.*.quantity.min' => 'La cantidad no puede ser negativa.',
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

            $consumptionNote = ConsumptionNote::create($validated);

            foreach ($validated['note_details'] as $detail) {
                $consumptionNote->details()->create($detail);
            }

            $errors = [];

            if ($consumptionNote->status_id === 9) {
                // Primer paso: Verificar disponibilidad de todos los ingredientes
                foreach ($consumptionNote->details as $detail) {
                    $recipe = Recipe::with('ingredients')->find($detail->recipe_id);
                    if (!$recipe) {
                        $errors[] = "Los ingredientes para la receta no existen";
                        continue;
                    }

                    foreach ($recipe->ingredients as $ingredient) {
                        $inventory = Inventory::where('product_id', $ingredient->product_id)->first();
                        $required = $ingredient->quantity * $detail->quantity;

                        if (!$inventory) {
                            $errors[] = "No se encontró inventario para {$ingredient->name}";
                            continue;
                        }

                        if ($inventory->available_quantity < $required) {
                            $errors[] = "Cantidad no disponible de {$ingredient->name}. Disponible: {$inventory->available_quantity}, Necesario: {$required}";
                        }
                    }
                }

                if (!empty($errors)) {
                    DB::rollBack();
                    return response()->json([
                        'message' => $errors,
                    ], 400);
                }

                // Segunda pasada: Actualizar inventario si no hay errores
                foreach ($consumptionNote->details as $detail) {
                    $recipe = Recipe::with('ingredients')->find($detail->recipe_id);
                    foreach ($recipe->ingredients as $ingredient) {
                        $inventory = Inventory::where('product_id', $ingredient->product_id)->first();
                        $required = $ingredient->quantity * $detail->quantity;

                        $inventory->decrement('available_quantity', $required);

                        InventoryTransaction::create([
                            'inventory_id' => $inventory->id,
                            'transaction_type' => 'salida',
                            'quantity' => $required,
                            'user_id' => $user->id,
                            'transaction_date' => now(),
                            'notes' => 'Venta, Nota de Consumo: ' . $consumptionNote->id
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json($consumptionNote->fresh(['details']));
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
        $consumptionNote = ConsumptionNote::findOrFail($id);

        return response()->json($consumptionNote);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        DB::beginTransaction();

        try {
            $user = $request->user();
            $request['user_id'] = $user->id;

            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'client_id' => 'required|exists:clients,id',
                'issued_at' => 'nullable|date',
                'cancelled_at' => 'nullable|date',
                'address' => 'required|string|max:255',
                'discount' => 'nullable|integer',
                'status_id' => 'required|exists:statuses,id',
                'note_details' => 'required|array',
                'note_details.*.recipe_id' => 'required|exists:recipes,id',
                'note_details.*.unit_price' => 'required|decimal:0,2|min:1',
                'note_details.*.quantity' => 'required|integer|min:1',
            ], [
                'user_id.required' => 'El ID de usuario es obligatorio.',
                'user_id.exists' => 'El ID de usuario seleccionado no es válido.',
                'status_id.required' => 'El ID de estado es obligatorio.',
                'status_id.exists' => 'El ID de estado seleccionado no es válido.',
                'client_id.required' => 'El ID de cliente es obligatorio.',
                'client_id.exists' => 'El ID de cliente seleccionado no es válido.',
                'issued_at.date' => 'La fecha de emisión debe ser una fecha válida.',
                'discount.integer' => 'El decuento debe ser un número entero.',
                'address.string' => 'La dirección debe ser una cadena de texto.',
                'address.max' => 'La dirección no debe exceder los 255 caracteres.',
                'cancelled_at.date' => 'La fecha de cancelación debe ser una fecha válida.',
                'note_details.required' => 'Debe incluir al menos un detalle en la orden.',
                'note_details.array' => 'El formato de los detalles de la orden no es válido.',
                'note_details.*.recipe_id.required' => 'El detalle es obligatorio.',
                'note_details.*.recipe_id.exists' => 'El detalle seleccionado no es válido.',
                'note_details.*.unit_price.required' => 'El precio unitario es obligatorio.',
                'note_details.*.unit_price.decimal' => 'El precio unitario debe ser un número decimal.',
                'note_details.*.unit_price.min' => 'El precio unitario debe ser al menos 1.',
                'note_details.*.quantity.required' => 'La cantidad es obligatorio.',
                'note_details.*.quantity.integer' => 'La cantidad debe ser un número entero.',
                'note_details.*.quantity.min' => 'La cantidad no puede ser negativa.',
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

            $consumptionNote = ConsumptionNote::with('details')->findOrFail($id);

            // Actualizar detalles de la nota
            foreach ($validated['note_details'] as $detail) {
                $noteDetail = $consumptionNote->details()
                    ->where('recipe_id', $detail['recipe_id'])
                    ->firstOrFail();

                $noteDetail->update([
                    'quantity' => $detail['quantity'],
                    'unit_price' => $detail['unit_price']
                ]);
            }

            // Recupera Otra vez la data pero actualizada
            $consumptionNote = ConsumptionNote::with('details')->findOrFail($id);
            $statusOld = $consumptionNote->status_id;

            $consumptionNote->update([
                'user_id' => $validated['user_id'],
                'client_id' => $validated['client_id'],
                'issued_at' => $validated['status_id'] === 9 ? now() : null,
                'cancelled_at' => $validated['status_id'] === 10 ? now() : null,
                'status_id' => $validated['status_id'],
                'address' => $validated['address']
            ]);

            $errors = [];

            if ($consumptionNote->status_id === 9 && $statusOld !== 9) {
                // Primer paso: Verificar disponibilidad de todos los ingredientes
                foreach ($consumptionNote->details as $detail) {
                    $recipe = Recipe::with('ingredients')->find($detail->recipe_id);
                    if (!$recipe) {
                        $errors[] = "Los ingredientes para la receta no existen";
                        continue;
                    }

                    foreach ($recipe->ingredients as $ingredient) {
                        $inventory = Inventory::where('product_id', $ingredient->product_id)->first();
                        $required = $ingredient->quantity * $detail->quantity;

                        if (!$inventory) {
                            $errors[] = "No se encontró inventario para {$ingredient->name}";
                            continue;
                        }

                        if ($inventory->available_quantity < $required) {
                            $errors[] = "Cantidad no disponible de {$inventory->product_name}. Disponible: {$inventory->available_quantity} {$inventory->unit_abbr}, Necesario: {$required} {$inventory->unit_abbr}";
                        }
                    }
                }

                if (!empty($errors)) {
                    DB::rollBack();
                    return response()->json([
                        'message' => $errors,
                    ], 400);
                }

                // Segunda pasada: Actualizar inventario si no hay errores
                foreach ($consumptionNote->details as $detail) {
                    $recipe = Recipe::with('ingredients')->find($detail->recipe_id);
                    foreach ($recipe->ingredients as $ingredient) {
                        $inventory = Inventory::where('product_id', $ingredient->product_id)->first();
                        $required = $ingredient->quantity * $detail->quantity;

                        $inventory->decrement('available_quantity', $required);

                        InventoryTransaction::create([
                            'inventory_id' => $inventory->id,
                            'transaction_type' => 'salida',
                            'quantity' => $required,
                            'user_id' => $user->id,
                            'transaction_date' => now(),
                            'notes' => 'Venta, Nota de Consumo: 1'
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json($consumptionNote->fresh(['details']));
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
        $consumptionNote = ConsumptionNote::findOrFail($id);
        $consumptionNote->status_id = 2; // Cliente inactivo

        // $consumptionNote->delete();

        return response()->json(null, 204);
    }
}

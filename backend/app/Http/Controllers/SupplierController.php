<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use Illuminate\Support\Facades\Validator;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener parámetros de búsqueda
            $documentNumber = $request->query('document_number');
            $name = $request->query('name');

            // Iniciar consulta segura
            $query = Supplier::query();

            // Aplicar filtro por documento de forma segura
            if (!empty($documentNumber)) {
                $query->whereRaw('LOWER(document_number) LIKE ?', ['%' . strtolower($documentNumber) . '%']);
            }

            // Aplicar filtro por nombre completo de forma segura
            if (!empty($name)) {
                $query->whereRaw('LOWER(CONCAT(name)) LIKE ?', ['%' . strtolower($name) . '%']);
            }

            // Obtener datos filtrados
            $suppliers = $query->where('status_id', 1)->get();

            return response()->json($suppliers, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la consulta: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request['phone_number'] = (int) $request['phone_number'];

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:suppliers',
            'email' => 'required|string|email|max:255|unique:suppliers',
            'document_number' => 'required|integer|unique:suppliers',
            'document_type_id' => 'required|exists:document_types,id',
            'phone_operator_id' => 'required|exists:phone_operators,id',
            'phone_number' => 'required|integer',
            'address' => 'required|string|max:255',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'name.unique' => 'La Razón Social ya está en uso.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.string' => 'El correo electrónico debe ser una cadena de texto.',
            'email.email' => 'El correo electrónico debe ser una dirección de correo válida.',
            'email.max' => 'El correo electrónico no debe exceder los 255 caracteres.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'document_number.required' => 'El número de documento es obligatorio.',
            'document_number.integer' => 'El número de documento debe ser un número entero.',
            'document_number.unique' => 'El número de documento ya está en uso.',
            'document_type_id.required' => 'El tipo de documento es obligatorio.',
            'document_type_id.exists' => 'El tipo de documento seleccionado no es válido.',
            'phone_operator_id.required' => 'El operador telefónico es obligatorio.',
            'phone_operator_id.exists' => 'El operador telefónico seleccionado no es válido.',
            'phone_number.required' => 'El número de teléfono es obligatorio.',
            'phone_number.integer' => 'El número de teléfono debe ser un número entero.',
            'address.required' => 'La dirección es obligatoria.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe exceder los 255 caracteres.',
        ]);

        if ($validator->fails()) {
            $errorMessages = collect(['Error de validación: '])
                ->merge($validator->errors()->all())
                ->toArray();

            return response()->json([
                'message' => $errorMessages,
            ], 400);
        }

        // Obtener los datos validados
        $validated = $validator->validated();

        // Asignar status_id por defecto a 1 (Activo)
        $validated['status_id'] = 1;

        // Crear el usuario con los datos validados y modificados
        $supplier = Supplier::create($validated);

        return response()->json($supplier, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $supplier = Supplier::findOrFail($id);

        return response()->json($supplier);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:suppliers,email,' . $id,
            'document_number' => 'required|integer|unique:suppliers,document_number,' . $id,
            'document_type_id' => 'required|exists:document_types,id',
            'phone_operator_id' => 'required|exists:phone_operators,id',
            'phone_number' => 'required|integer',
            'address' => 'required|string|max:255',
            'status_id' => 'required|exists:statuses,id',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.string' => 'El correo electrónico debe ser una cadena de texto.',
            'email.email' => 'El correo electrónico debe ser una dirección de correo válida.',
            'email.max' => 'El correo electrónico no debe exceder los 255 caracteres.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'document_number.required' => 'El número de documento es obligatorio.',
            'document_number.integer' => 'El número de documento debe ser un número entero.',
            'document_number.unique' => 'El número de documento ya está en uso.',
            'document_type_id.required' => 'El tipo de documento es obligatorio.',
            'document_type_id.exists' => 'El tipo de documento seleccionado no es válido.',
            'phone_operator_id.required' => 'El operador telefónico es obligatorio.',
            'phone_operator_id.exists' => 'El operador telefónico seleccionado no es válido.',
            'phone_number.required' => 'El número de teléfono es obligatorio.',
            'phone_number.integer' => 'El número de teléfono debe ser un número entero.',
            'address.required' => 'La dirección es obligatoria.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe exceder los 255 caracteres.',
            'status_id.required' => 'El estado es obligatorio.',
            'status_id.exists' => 'El estado seleccionado no es válido.',
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

        $supplier = Supplier::findOrFail($id);
        $supplier->update($validated);

        return response()->json($supplier);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->status_id = 2;
        $supplier->update();

        // $supplier->delete();

        return response()->json(null, 204);
    }
}

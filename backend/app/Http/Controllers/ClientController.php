<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener parámetros de búsqueda
            $documentNumber = $request->query('document_number');
            $fullName = $request->query('full_name');

            // Iniciar consulta segura
            $query = Client::query();

            // Aplicar filtro por documento de forma segura
            if (!empty($documentNumber)) {
                $query->whereRaw('LOWER(document_number) LIKE ?', ['%' . strtolower($documentNumber) . '%']);
            }

            // Aplicar filtro por nombre completo de forma segura
            if (!empty($fullName)) {
                $query->whereRaw('LOWER(CONCAT(names, " ", surnames)) LIKE ?', ['%' . strtolower($fullName) . '%']);
            }

            // Obtener datos filtrados
            $clients = $query->where('status_id', 1)->get();

            return response()->json($clients, 200);
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
            'names' => 'required|string|max:255',
            'surnames' => 'required|string|max:255',
            'document_number' => 'required|string|unique:clients',
            'document_type_id' => 'required|exists:document_types,id',
            'nationality' => 'required|string|max:255',
            'gender_id' => 'required|exists:genders,id',
            'phone_operator_id' => 'required|exists:phone_operators,id',
            'phone_number' => 'required|integer',
            'address' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:clients',
        ], [
            'names.required' => 'Los nombres son obligatorios.',
            'names.string' => 'Los nombres deben ser una cadena de texto.',
            'names.max' => 'Los nombres no deben exceder los 255 caracteres.',
            'surnames.required' => 'Los apellidos son obligatorios.',
            'surnames.string' => 'Los apellidos deben ser una cadena de texto.',
            'surnames.max' => 'Los apellidos no deben exceder los 255 caracteres.',
            'document_number.required' => 'El número de documento es obligatorio.',
            'document_number.string' => 'El número de documento debe ser valido.',
            'document_number.unique' => 'El número de documento ya está en uso.',
            'document_type_id.required' => 'El tipo de documento es obligatorio.',
            'document_type_id.exists' => 'El tipo de documento seleccionado no es válido.',
            'nationality.required' => 'La nacionalidad es obligatoria.',
            'nationality.string' => 'La nacionalidad debe ser una cadena de texto.',
            'nationality.max' => 'La nacionalidad no debe exceder los 255 caracteres.',
            'gender_id.required' => 'El género es obligatorio.',
            'gender_id.exists' => 'El género seleccionado no es válido.',
            'phone_operator_id.required' => 'El operador telefónico es obligatorio.',
            'phone_operator_id.exists' => 'El operador telefónico seleccionado no es válido.',
            'phone_number.required' => 'El número de teléfono es obligatorio.',
            'phone_number.integer' => 'El número de teléfono debe ser un número entero.',
            'address.required' => 'La dirección es obligatoria.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe exceder los 255 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.string' => 'El correo electrónico debe ser una cadena de texto.',
            'email.email' => 'El correo electrónico debe ser una dirección de correo válida.',
            'email.max' => 'El correo electrónico no debe exceder los 255 caracteres.',
            'email.unique' => 'El correo electrónico ya está en uso.',
        ]);

        if ($validator->fails()) {
            $data = [
                'errors' => $validator->errors(),
                'message' => 'Error durante la validación de datos.',
            ];
            return response()->json($data, 400);
        }

        // Obtener los datos validados
        $validated = $validator->validated();

        // Asignar status_id por defecto a 1 (Activo)
        $validated['status_id'] = 1;

        // Crear el usuario con los datos validados y modificados
        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::findOrFail($id);

        return response()->json($client);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'names' => 'required|string|max:255',
            'surnames' => 'required|string|max:255',
            'document_number' => 'required|string|unique:clients,document_number,' . $id,
            'document_type_id' => 'required|exists:document_types,id',
            'nationality' => 'required|string|max:255',
            'gender_id' => 'required|exists:genders,id',
            'phone_operator_id' => 'required|exists:phone_operators,id',
            'phone_number' => 'required|integer',
            'address' => 'required|string|max:255',
            'status_id' => 'required|exists:statuses,id',
            'email' => 'required|string|email|max:255|unique:clients,email,' . $id,
        ], [
            'names.required' => 'Los nombres son obligatorios.',
            'names.string' => 'Los nombres deben ser una cadena de texto.',
            'names.max' => 'Los nombres no deben exceder los 255 caracteres.',
            'surnames.required' => 'Los apellidos son obligatorios.',
            'surnames.string' => 'Los apellidos deben ser una cadena de texto.',
            'surnames.max' => 'Los apellidos no deben exceder los 255 caracteres.',
            'document_number.required' => 'El número de documento es obligatorio.',
            'document_number.string' => 'El número de documento debe ser valido.',
            'document_number.unique' => 'El número de documento ya está en uso.',
            'document_type_id.required' => 'El tipo de documento es obligatorio.',
            'document_type_id.exists' => 'El tipo de documento seleccionado no es válido.',
            'nationality.required' => 'La nacionalidad es obligatoria.',
            'nationality.string' => 'La nacionalidad debe ser una cadena de texto.',
            'nationality.max' => 'La nacionalidad no debe exceder los 255 caracteres.',
            'gender_id.required' => 'El género es obligatorio.',
            'gender_id.exists' => 'El género seleccionado no es válido.',
            'phone_operator_id.required' => 'El operador telefónico es obligatorio.',
            'phone_operator_id.exists' => 'El operador telefónico seleccionado no es válido.',
            'phone_number.required' => 'El número de teléfono es obligatorio.',
            'phone_number.integer' => 'El número de teléfono debe ser un número entero.',
            'address.required' => 'La dirección es obligatoria.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe exceder los 255 caracteres.',
            'status_id.required' => 'El estado es obligatorio.',
            'status_id.exists' => 'El estado seleccionado no es válido.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.string' => 'El correo electrónico debe ser una cadena de texto.',
            'email.email' => 'El correo electrónico debe ser una dirección de correo válida.',
            'email.max' => 'El correo electrónico no debe exceder los 255 caracteres.',
            'email.unique' => 'El correo electrónico ya está en uso.',
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

        $client = Client::findOrFail($id);
        $client->update($validated);

        return response()->json($client);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::findOrFail($id);
        $client->status_id = 2;
        $client->update();

        // $client->delete();

        return response()->json(null, 204);
    }
}

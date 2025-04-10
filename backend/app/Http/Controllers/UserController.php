<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
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
            $query = User::query();

            // Aplicar filtro por documento de forma segura
            if (!empty($documentNumber)) {
                $query->whereRaw('LOWER(document_number) LIKE ?', ['%' . strtolower($documentNumber) . '%']);
            }

            // Aplicar filtro por nombre completo de forma segura
            if (!empty($fullName)) {
                $query->whereRaw('LOWER(CONCAT(names, " ", surnames)) LIKE ?', ['%' . strtolower($fullName) . '%']);
            }

            // Obtener datos filtrados
            $users = $query->where('status_id', 1)->get();

            return response()->json($users, 200);
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
            'document_number' => 'required|integer|unique:users',
            'document_type_id' => 'required|exists:document_types,id',
            'nationality' => 'required|string|max:255',
            'gender_id' => 'required|exists:genders,id',
            'role_id' => 'required|exists:roles,id',
            'phone_operator_id' => 'required|exists:phone_operators,id',
            'phone_number' => 'required|integer',
            'address' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ], [
            'names.required' => 'Los nombres son obligatorios.',
            'names.string' => 'Los nombres deben ser una cadena de texto.',
            'names.max' => 'Los nombres no deben exceder los 255 caracteres.',
            'surnames.required' => 'Los apellidos son obligatorios.',
            'surnames.string' => 'Los apellidos deben ser una cadena de texto.',
            'surnames.max' => 'Los apellidos no deben exceder los 255 caracteres.',
            'document_number.required' => 'El número de documento es obligatorio.',
            'document_number.integer' => 'El número de documento debe ser un número entero.',
            'document_number.unique' => 'El número de documento ya está en uso.',
            'document_type_id.required' => 'El tipo de documento es obligatorio.',
            'document_type_id.exists' => 'El tipo de documento seleccionado no es válido.',
            'nationality.required' => 'La nacionalidad es obligatoria.',
            'nationality.string' => 'La nacionalidad debe ser una cadena de texto.',
            'nationality.max' => 'La nacionalidad no debe exceder los 255 caracteres.',
            'gender_id.required' => 'El género es obligatorio.',
            'gender_id.exists' => 'El género seleccionado no es válido.',
            'rol_id.required' => 'El rol es obligatorio.',
            'rol_id.exists' => 'El rol seleccionado no es válido.',
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
            'password.required' => 'La contraseña es obligatoria.',
            'password.string' => 'La contraseña debe ser una cadena de texto.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
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
        $user = User::create($validated);

        return response()->json($user, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::findOrFail($id);

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'names' => 'required|string|max:255',
            'surnames' => 'required|string|max:255',
            'document_number' => 'required|integer|unique:users,document_number,' . $id,
            'document_type_id' => 'required|exists:document_types,id',
            'nationality' => 'required|string|max:255',
            'gender_id' => 'required|exists:genders,id',
            'phone_operator_id' => 'required|exists:phone_operators,id',
            'phone_number' => 'required|integer',
            'address' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
        ], [
            'names.required' => 'Los nombres son obligatorios.',
            'names.string' => 'Los nombres deben ser una cadena de texto.',
            'names.max' => 'Los nombres no deben exceder los 255 caracteres.',
            'surnames.required' => 'Los apellidos son obligatorios.',
            'surnames.string' => 'Los apellidos deben ser una cadena de texto.',
            'surnames.max' => 'Los apellidos no deben exceder los 255 caracteres.',
            'document_number.required' => 'El número de documento es obligatorio.',
            'document_number.integer' => 'El número de documento debe ser un número entero.',
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
            'password.nullable' => 'La contraseña es opcional.',
            'password.string' => 'La contraseña debe ser una cadena de texto.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
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

        $user = User::findOrFail($id);

        $user->update($validated);

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->status_id = 2;
        $user->update();

        // $user->delete();

        return response()->json(null, 204);
    }
}

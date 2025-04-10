<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener parámetros de búsqueda
            $name = $request->query('name');

            // Iniciar consulta segura
            $query = Product::query();

            // Aplicar filtro por nombre de forma segura
            if (!empty($name)) {
                $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($name) . '%']);
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
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

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
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

        $product = Product::findOrFail($id);
        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(null, 204);
    }
}

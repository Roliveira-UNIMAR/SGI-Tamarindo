<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Location::all()->map(function ($location) {
            return [
                'id' => $location->id,
                'name' => $location->name,
            ];
        })->toJson();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string|max:255',
            'is_refrigerated' => 'required|boolean',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'address.required' => 'La dirección es obligatorio.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe exceder los 255 caracteres.',
            'is_refrigerated.required' => 'El campo de refrigeración es obligatorio.',
            'is_refrigerated.boolean' => 'El campo de refrigeración debe ser verdadero o falso.',
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

        $location = Location::create($validated);

        return response()->json($location, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $location = Location::findOrFail($id);

        return response()->json($location);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string|max:255',
            'is_refrigerated' => 'required|boolean',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'address.required' => 'La dirección es obligatorio.',
            'address.string' => 'La dirección debe ser una cadena de texto.',
            'address.max' => 'La dirección no debe exceder los 255 caracteres.',
            'is_refrigerated.required' => 'El campo de refrigeración es obligatorio.',
            'is_refrigerated.boolean' => 'El campo de refrigeración debe ser verdadero o falso.',
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

        $location = Location::findOrFail($id);
        $location->update($validated);

        return response()->json($location);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $location = Location::findOrFail($id);
        $location->status_id = 2;
        $location->update();

        // $location->delete();

        return response()->json(null, 204);
    }
}

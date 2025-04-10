<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Recipe;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RecipeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Obtener parámetros de búsqueda
            $name = $request->query('name');
            $search = $request->query('search');

            // Iniciar consulta segura
            $query = Recipe::query()->join('categories', 'categories.id', '=', 'recipes.category_id')
                ->select('recipes.*', 'categories.name as category_name'); // Renombrar la columna para evitar conflictos

            // Aplicar filtro por nombre de receta
            if (!empty($name)) {
                $query->whereRaw('LOWER(recipes.name) LIKE ?', ['%' . strtolower($name) . '%']);
            }

            // Aplicar filtro por nombre de categoría
            if (!empty($search)) {
                $query->whereRaw('LOWER(recipes.name) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(categories.name) LIKE ?', ['%' . strtolower($search) . '%']);
            }

            // Filtrar por estado activo
            $recipes = $query->where('recipes.status_id', 1)->get();

            return response()->json($recipes, 200);
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
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'recipe_ingredients' => 'required|array',
            'recipe_ingredients.*.product_id' => 'required|exists:products,id',
            'recipe_ingredients.*.quantity' => 'required|integer|min:0',
            'recipe_ingredients.*.unit_id' => 'required|exists:units,id',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'category_id.required' => 'El ID de la categoria es obligatorio.',
            'category_id.exists' => 'El ID de la categoria no es válido.',
            'recipe_ingredients.required' => 'Los detalles de la orden son requeridos.',
            'recipe_ingredients.*.product_id.required' => 'El ID del producto es obligatorio.',
            'recipe_ingredients.*.product_id.exists' => 'El ID del producto no es válido.',
            'recipe_ingredients.*quantity.required' => 'La cantidad es obligatoria.',
            'recipe_ingredients.*quantity.integer' => 'La cantidad debe ser un número entero.',
            'recipe_ingredients.*quantity.min' => 'La cantidad no puede ser negativa.',
            'recipe_ingredients.*.unit_id.required' => 'El ID de la unidad es obligatorio.',
            'recipe_ingredients.*.unit_id.exists' => 'El ID de la unidad no es válido.',
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

        $recipe = Recipe::create($validated);


        foreach ($validated['recipe_ingredients'] as $ingredient) {
            $recipe->ingredients()->create($ingredient);
        }



        return response()->json($recipe, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $recipe = Recipe::findOrFail($id);

        return response()->json($recipe);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'recipe_ingredients' => 'required|array',
            'recipe_ingredients.*.product_id' => 'required|exists:products,id',
            'recipe_ingredients.*.quantity' => 'required|numeric|min:0',
            'recipe_ingredients.*.unit_id' => 'required|exists:units,id',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'name.max' => 'El nombre no debe exceder los 255 caracteres.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'category_id.required' => 'El ID de la categoria es obligatorio.',
            'category_id.exists' => 'El ID de la categoria no es válido.',
            'recipe_ingredients.required' => 'Los ingredientes son requeridos.',
            'recipe_ingredients.*.product_id.required' => 'El ID del producto es obligatorio.',
            'recipe_ingredients.*.product_id.exists' => 'El producto seleccionado no existe.',
            'recipe_ingredients.*.quantity.required' => 'La cantidad es obligatoria.',
            'recipe_ingredients.*.quantity.numeric' => 'La cantidad debe ser un número.',
            'recipe_ingredients.*.quantity.min' => 'La cantidad no puede ser negativa.',
            'recipe_ingredients.*.unit_id.required' => 'La unidad es obligatoria.',
            'recipe_ingredients.*.unit_id.exists' => 'La unidad seleccionada no existe.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
                'message' => 'Error de validación'
            ], 422);
        }

        $validated = $validator->validated();

        DB::beginTransaction();

        try {
            $recipe = Recipe::findOrFail($id);

            // Actualizar datos principales
            $recipe->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price']
            ]);

            // Obtener IDs de productos entrantes
            $incomingProductIds = collect($validated['recipe_ingredients'])
                ->pluck('product_id')
                ->toArray();

            // Eliminar ingredientes no presentes en la nueva lista
            $recipe->ingredients()
                ->whereNotIn('product_id', $incomingProductIds)
                ->delete();

            // Actualizar o crear ingredientes
            foreach ($validated['recipe_ingredients'] as $ingredient) {
                $recipe->ingredients()->updateOrCreate(
                    ['product_id' => $ingredient['product_id']],
                    [
                        'quantity' => $ingredient['quantity'],
                        'unit_id' => $ingredient['unit_id']
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'message' => 'Receta actualizada exitosamente',
                'recipe' => $recipe->load(['ingredients.product', 'ingredients.unit'])
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar la receta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $recipe = Recipe::findOrFail($id);
        $recipe->status_id = 2;
        $recipe->update();

        // $recipe->delete();

        return response()->json(null, 204);
    }
}

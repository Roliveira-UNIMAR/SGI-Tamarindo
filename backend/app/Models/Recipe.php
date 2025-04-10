<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category_id'
    ];

    protected $appends = [
        'recipe_ingredients',
        'category_name'
    ];

    protected $hidden = [
        'ingredients'
    ];

    public function ingredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    protected function categoryName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->category->name ?? 'Desconocida'
        );
    }

    protected function recipeIngredients(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->ingredients->map(fn($ingredient) => [
                'product_id' => $ingredient->product->id,
                'product_name' => $ingredient->product->name ?? 'No disponible',
                'quantity' => $ingredient->quantity,
                'unit_name' => $ingredient->unit->name ?? 'No disponible',
                'unit_id' => $ingredient->unit_id ?? 'No disponible',
            ])
        );
    }
}

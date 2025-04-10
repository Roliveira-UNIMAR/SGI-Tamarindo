<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description'
    ];

    // Relación muchos a muchos con productos
    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'category_recipes')
            ->withTimestamps();
    }

    // Accesor para formatear el nombre en mayúsculas
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }
}

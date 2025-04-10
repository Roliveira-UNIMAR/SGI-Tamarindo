<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'unit_id'
    ];

    protected $appends = [
        'unit_name',
    ];


    protected function casts(): array
    {
        return [
            'name' => 'string',
            'description' => 'string',
        ];
    }

    // Relación con el inventario
    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    // Accesor para formatear el nombre en mayúsculas
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }

    // Relación con la unidad de medida
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    protected function unitName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->unit->name ?? 'Desconocido'
        );
    }

    // Accesor para obtener la descripción con la primera letra en mayúscula
    protected function description(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }

    // Scope para buscar productos por nombre
    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'LIKE', "%{$term}%");
    }
}

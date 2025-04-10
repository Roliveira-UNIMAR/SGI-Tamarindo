<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location_id',
        'product_id',
        'available_quantity',
        'min_stock_level',
        'max_stock_level',
        'reorder_point',
        'requires_refrigeration',
        'unit_id'
    ];

    protected $appends = [
        'address',
        'is_available',
        'product_name',
        'unit_abbr',
        'unit_name'
    ];

    protected $hidden = [
        'location',
    ];

    protected function casts(): array
    {
        return [
            'available_quantity' => 'integer',
            'min_stock_level' => 'integer',
            'max_stock_level' => 'integer',
            'reorder_point' => 'integer',
            'requires_refrigeration' => 'boolean',
        ];
    }

    // Accesor para formatear el nombre en mayúsculas
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }

    // Relación con la ubicación del inventario
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    // Accesor para la dirección del inventario
    protected function address(): Attribute
    {
        return Attribute::make(
            get: fn() => mb_strtoupper($this->location->address ?? 'Desconocido'),
            set: fn() => ucfirst(strtolower($this->location->address ?? 'Desconocido'))
        );
    }

    // Relación con la unidad de medida
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    // Relación con el producto
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected function productName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->product->name ?? 'Desconocido'
        );
    }

    protected function unitName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->unit->name ?? 'Desconocido'
        );
    }

    protected function unitAbbr(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->unit->abbreviation ?? 'Desconocido'
        );
    }

    // Verificar si el stock está por debajo del mínimo
    public function isLowStock(): bool
    {
        return $this->available_quantity <= $this->min_stock_level;
    }

    // Verificar si el producto esta disponible
    protected function isAvailable(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->available_quantity > 0
        );
    }

    // Scope para obtener solo los productos con stock bajo
    public function scopeLowStock($query)
    {
        return $query->whereColumn('available_quantity', '<=', 'min_stock_level');
    }

    // Scope para inventarios que requieren refrigeración
    public function scopeRefrigerated($query)
    {
        return $query->where('requires_refrigeration', true);
    }
}

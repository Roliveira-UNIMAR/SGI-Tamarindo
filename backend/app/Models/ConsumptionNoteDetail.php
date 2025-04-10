<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ConsumptionNoteDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'consumption_note_id',
        'recipe_id',
        'description',
        'quantity',
        'unit_price'
    ];

    protected $appends = [
        'total_price',
    ];


    // Relación con la nota de consumo
    public function consumptionNote(): BelongsTo
    {
        return $this->belongsTo(ConsumptionNote::class);
    }

    // Relación con la receta (producto vendido)
    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    // Accesor para calcular el precio total de la línea (cantidad * precio unitario)
    protected function totalPrice(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->quantity * $this->unit_price
        );
    }
}

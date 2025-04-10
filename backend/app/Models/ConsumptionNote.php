<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ConsumptionNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'issued_at',
        'cancelled_at',
        'address',
        'status_id',
        'discount'
    ];

    protected $appends = [
        'client_name',
        'user_name',
        'client_document',
        'user_name',
        'note_details',
        'subtotal',
        'total'
    ];

    protected $hidden = [
        'client',
        'status',
        'user',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'discount' => 'integer',
    ];

    // Relación con los detalles de la nota de consumo
    public function details(): HasMany
    {
        return $this->hasMany(ConsumptionNoteDetail::class);
    }

    // Relación con el usuario que emitió la nota
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el cliente asociado a la nota
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    // Accesor para nombre del cliente
    protected function clientName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->client->full_name ?? ''
        );
    }

    // Accesor para el documento del cliente
    protected function clientDocument(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->client->document ?? ''
        );
    }

    // Accesor para nombre del Usuario
    protected function userName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->user->full_name ?? ''
        );
    }

    // Accesor para el lugar de emisión
    protected function address(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }

    protected function statusName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->status->name ?? 'Sin estado'
        );
    }

    // Accesor para obtener los detalles de la nota de consumo (productos y cantidades)
    protected function noteDetails(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->details->map(fn($detail) => [
                'recipe_id' => $detail->recipe->id,
                'recipe_name' => $detail->recipe->name ?? 'Desconocido',
                'quantity' => $detail->quantity,
                'unit_price' => $detail->unit_price,
                'total_price' => $detail->total_price
            ])
        );
    }

    // **Accesor para calcular el subtotal**
    protected function subtotal(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->details->sum(fn($detail) => $detail->total_price)
        );
    }

    // Accesor para calcular el total (subtotal - descuento)
    protected function total(): Attribute
    {
        return Attribute::make(
            get: fn() => max(0, $this->subtotal - ($this->subtotal * ($this->discount ?? 0) / 100))
        );
    }


    // Verifica si la nota ha sido cancelada
    public function isCancelled(): bool
    {
        return !is_null($this->cancelled_at);
    }

    // Marca la nota como emitida
    public function markAsIssued()
    {
        $this->update(['issued_at' => now()]);
    }

    // Marca la nota como cancelada
    public function markAsCancelled()
    {
        $this->update(['cancelled_at' => now()]);
    }
}

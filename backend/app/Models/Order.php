<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Enums\OrderStatus;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'supplier_id',
        'ordered_at',
        'received_at',
        'notes',
        'status_id'
    ];

    protected $appends = [
        'status_name',
        'supplier_name',
        'supplier_document',
        'supplier_phone',
        'user_name',
        'order_details'
    ];

    protected $hidden = [
        'status',
        'supplier',
        'user',
    ];

    public function details(): HasMany
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    protected function supplierName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->supplier->name ?? ''
        );
    }

    protected function supplierDocument(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->supplier->document  ?? ''
        );
    }

    protected function supplierPhone(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->supplier->phone ?? ''
        );
    }

    protected function userName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->user->full_name ?? 'Desconocido'
        );
    }

    protected function statusName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->status->name ?? 'Sin estado'
        );
    }

    protected function notes(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }

    protected function orderDetails(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->details->map(fn($detail) => [
                'id' => $detail->id ?? '0',
                'product_id' => $detail->product->id ?? '0',
                'product_name' => $detail->product->name ?? 'Sin producto',
                'received_quantity' => $detail->received_quantity,
                'ordered_quantity' => $detail->ordered_quantity,
                'unit_name' => $detail->product->unit_name,
            ])
        );
    }

    public function markAsReceived(): void
    {
        $this->update([
            'received_at' => now(),
            'status_id' => OrderStatus::RECIBIDA->value
        ]);
    }

    public function scopePending($query)
    {
        return $query->where('status_id', OrderStatus::ENVIADA);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('ordered_at', '>=', now()->subDays($days));
    }
}

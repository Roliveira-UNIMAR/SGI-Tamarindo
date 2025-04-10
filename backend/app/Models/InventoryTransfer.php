<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class InventoryTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_inventory_id',
        'to_inventory_id',
        'transferred_quantity',
        'user_id',
        'transferred_at',
    ];

    protected $casts = [
        'transferred_at' => 'datetime',
    ];

    public function fromInventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class, 'from_inventory_id');
    }

    public function toInventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class, 'to_inventory_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function transferredAtFormatted(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->transferred_at?->format('d/m/Y H:i')
        );
    }
}

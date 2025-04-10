<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'inventory_id',
        'transaction_type',
        'quantity',
        'user_id',
        'transaction_date',
        'notes'
    ];

    protected $appends = [
        'product_name',
        'unit_name',
    ];

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected function productName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->inventory->product->name ?? 'Desconocido'
        );
    }

    protected function unitName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->inventory->unit->name ?? 'Desconocido'
        );
    }

    protected function transactionType(): Attribute
    {
        return Attribute::make(
            get: fn($value) => ucfirst(strtolower($value)),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }
}

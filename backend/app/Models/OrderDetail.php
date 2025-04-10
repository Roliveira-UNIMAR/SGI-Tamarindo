<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'ordered_quantity',
        'received_quantity'
    ];

    // Relación con la orden
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // Relación con el producto
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}

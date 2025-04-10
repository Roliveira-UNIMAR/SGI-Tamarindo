<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['abbreviation'];

    // Accesor para formatear la abrebación en mayúsculas
    protected function abbreviation(): Attribute
    {
        return Attribute::make(
            get: fn($value) => strtolower($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }
}

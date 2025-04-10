<?php

namespace App\Enums;

// Estados simples
enum SimpleStatus: int
{
    case ACTIVO = 1;
    case INACTIVO = 2;

    public function label(): string
    {
        return match($this) {
            self::ACTIVO => 'Activo',
            self::INACTIVO => 'Inactivo',
        };
    }
}

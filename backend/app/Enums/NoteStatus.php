<?php

namespace App\Enums;

// Estados para Notas de Consumo
enum NoteStatus: int
{
    case PENDIENTE = 7;
    case ANULADA = 8;
    case EMITIDA = 9;
    case CANCELADA = 10;


    public function label(): string
    {
        return match($this) {
            self::ANULADA => 'Anulada',
            self::PENDIENTE => 'Pendiente',
            self::EMITIDA => 'Emitida',
            self::CANCELADA => 'Cancelada',
        };
    }
}

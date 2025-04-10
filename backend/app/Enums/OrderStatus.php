<?php

namespace App\Enums;

// Estados para Órdenes de Compra
enum OrderStatus: int
{
    case ENVIADA = 3;
    case RECIBIDA = 4;
    case RETRASADA = 5;
    case VERIFICADA = 6;
    case PENDIENTE = 7;
    case ANULADA = 8;

    public function label(): string
    {
        return match($this) {
            self::ENVIADA => 'Enviada',
            self::RECIBIDA => 'Recibida',
            self::RETRASADA => 'Retrasada',
            self::VERIFICADA => 'Verificada',
            self::PENDIENTE => 'Pendiente',
            self::ANULADA => 'Anulada',
        };
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Enums\SimpleStatus;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'document_number',
        'document_type_id',
        'phone_operator_id',
        'phone_number',
        'address',
        'status_id'
    ];

    protected $appends = [
        'document_char',
        'document',
        'phone',
        'phone_code',
        'status_name'
    ];

    protected $hidden = [
        'document_type',
        'gender',
        'phone_operator',
        'status',
        'documentType',
        'phoneOperator'
    ];

    // Accesor para formatear el nombre en mayúsculas
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    protected function documentChar(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->documentType->char ?? '',
        );
    }

    protected function document(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Verificar que tenemos los datos necesarios
                if (!$this->document_char || !$this->document_number) {
                    return '';
                }

                $documentNumber = (string) $this->document_number;
                $longitud = strlen($documentNumber);

                // Manejar caso de cadena vacía
                if ($longitud === 0) {
                    return '';
                }

                // Extraer últimos componentes
                $ultimoDigito = substr($documentNumber, -1);
                $cadenaBase = substr($documentNumber, 0, -1) ?: '';

                // Aplicar padding de ceros a la izquierda para 8 dígitos
                $cadenaBasePadded = str_pad($cadenaBase, 8, '0', STR_PAD_LEFT);

                return sprintf(
                    '%s-%s-%s',
                    $this->document_char,
                    $cadenaBasePadded,
                    $ultimoDigito
                );
            }
        );
    }

    public function phoneOperator()
    {
        return $this->belongsTo(PhoneOperator::class);
    }

    protected function phoneCode(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->phoneOperator->code ?? '',
        );
    }

    protected function phone(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->phone_code . "-" . $this->phone_number,
        );
    }

    protected function address(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }

    protected function genderChar(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->gender->char ?? '',
        );
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    protected function statusName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->status->name ?? 'Sin estado'
        );
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Enums\SimpleStatus;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'names',
        'surnames',
        'document_number',
        'document_type_id',
        'nationality',
        'gender_id',
        'phone_operator_id',
        'phone_number',
        'address',
        'status_id',
        'email'
    ];

    protected $appends = [
        'document_char',
        'document',
        'gender_char',
        'phone',
        'phone_code',
        'full_name',
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

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn() => trim($this->names . ' ' . $this->surnames)
        );
    }

    protected function names(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => mb_strtoupper($value)
        );
    }

    protected function surnames(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => mb_strtoupper($value)
        );
    }

    protected function documentNumber(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => mb_strtoupper($value)
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
            get: fn() => $this->document_char . "-" . $this->document_number,
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
            set: fn($value) => mb_strtoupper($value)
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

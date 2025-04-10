<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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
        'email',
        'password',
        'role_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'document_type',
        'gender',
        'phone_operator',
        'status',
        'documentType',
        'phoneOperator'
    ];

    protected $appends = [
        'document_char',
        'document',
        'gender_char',
        'phone',
        'phone_code',
        'full_name',
        'status_name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn() => trim($this->names . ' ' . $this->surnames)
        );
    }

    // Accesor para formatear el nombre en mayúsculas
    protected function names(): Attribute
    {
        return Attribute::make(
            get: fn($value) => mb_strtoupper($value),
            set: fn($value) => ucfirst(strtolower($value))
        );
    }

    // Accesor para formatear el nombre en mayúsculas
    protected function surnames(): Attribute
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

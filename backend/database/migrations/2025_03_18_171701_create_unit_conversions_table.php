<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('unit_conversions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('from_unit_id'); // Unidad de origen (ejemplo: kg)
            $table->unsignedBigInteger('to_unit_id');   // Unidad de destino (ejemplo: g)
            $table->decimal('conversion_factor', 10, 6); // Factor de conversión (ejemplo: 1000 para kg a g)
            $table->timestamps();

            // Claves foráneas
            $table->foreign('from_unit_id')->references('id')->on('units')->onDelete('cascade');
            $table->foreign('to_unit_id')->references('id')->on('units')->onDelete('cascade');

            // Asegurar que no haya conversiones duplicadas
            $table->unique(['from_unit_id', 'to_unit_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_conversions');
    }
};

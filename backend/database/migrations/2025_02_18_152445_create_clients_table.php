<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('names');
            $table->string('surnames');
            $table->string('document_number')->unique();
            $table->foreignId('document_type_id')->constrained();
            $table->string('nationality');
            $table->foreignId('gender_id')->constrained();
            $table->foreignId('phone_operator_id')->constrained();
            $table->integer('phone_number');
            $table->string('address');
            $table->foreignId('status_id')->default(1)->constrained();
            $table->string('email')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};

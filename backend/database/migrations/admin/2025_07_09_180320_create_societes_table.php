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
        Schema::create('societes', function (Blueprint $table) {
            $table->id();
            $table->string('matricule_fiscale')->unique();
            $table->string('uuid')->unique();
            $table->string('raison_sociale');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('site_web')->nullable();
            $table->string('address')->nullable();
            $table->string('cachet')->nullable();
            $table->text('logo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('societes');
    }
};

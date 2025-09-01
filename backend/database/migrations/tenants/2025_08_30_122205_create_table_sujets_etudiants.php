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
        Schema::create('table_sujets_etudiants', function (Blueprint $table) {
            $table->id();
            $table->integer('id_sujet');
            $table->integer('id_etudiant');
            $table->text('raison_acceptation')->nullable();
            $table->text('raison_elimination')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_sujets_etudiants');
    }
};

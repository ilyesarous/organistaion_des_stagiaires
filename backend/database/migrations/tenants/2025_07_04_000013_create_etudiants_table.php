<?php

use App\Models\Events;
use App\Models\Facultee;
use App\Models\Societe;
use App\Models\Sujet;
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
        Schema::create('etudiants', function (Blueprint $table) {
            $table->id();
            $table->text('cv')->nullable();
            $table->text('convention')->nullable();
            $table->text('letterAffectation')->nullable();
            $table->text('autreFichier')->nullable();
            $table->timestamps();
        });
        Schema::table('etudiants', function (Blueprint $table) {
            $table->foreignIdFor(Facultee::class)
                ->constrained('facultees')
                ->cascadeOnDelete();
            $table->foreignIdFor(Sujet::class)
                ->nullable()
                ->constrained('sujets')
                ->nullOnDelete();
            $table->foreignIdFor(Events::class)
                ->nullable()
                ->constrained()
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};

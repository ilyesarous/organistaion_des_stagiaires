<?php

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
            $table->string('cv')->nullable();
            $table->string('convention')->nullable();
            $table->string('letterAffectation')->nullable();
            $table->timestamps();
        });
        Schema::table('etudiants', function (Blueprint $table) {
            $table->foreignIdFor(Facultee::class)
                ->constrained('facultees')
                ->cascadeOnDelete();
            $table->foreignIdFor(Societe::class)
                ->constrained('societes')
                ->cascadeOnDelete();
            $table->foreignIdFor(Sujet::class)
                ->constrained('sujets');
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

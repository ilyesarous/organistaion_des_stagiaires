<?php

use App\Models\Facultee;
use App\Models\Societe;
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
        Schema::create('facultees_societes', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Facultee::class)
                ->constrained('facultees')
                ->onDelete('cascade');
            $table->foreignIdFor(Societe::class)
                ->constrained('societes')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facultees_societes');
    }
};

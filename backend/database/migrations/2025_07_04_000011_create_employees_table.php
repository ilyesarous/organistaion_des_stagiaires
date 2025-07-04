<?php

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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('numBadge');
            $table->string('signature')->nullable();
            $table->timestamps();
        });
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignIdFor(Societe::class) // Use foreignIdFor for better readability
                ->constrained('societes')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};

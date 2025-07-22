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
        Schema::create('facultees', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('department')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('site_web')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facultees');
    }
};

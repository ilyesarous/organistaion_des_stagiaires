<?php

use App\Models\Gestion;
use App\Models\Role;
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
        Schema::create('roles_gestions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Role::class)->constrained('roles');
            $table->foreignIdFor(Gestion::class)->constrained('gestions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles_gestions');
    }
};

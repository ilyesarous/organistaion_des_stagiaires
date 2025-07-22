<?php

use App\Models\Employee;
use App\Models\Etudiant;
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
        Schema::create('employees_etudiants', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Employee::class)->constrained('employees')->onDelete('cascade');
            $table->foreignIdFor(Etudiant::class)->constrained('etudiants')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees_etudiants');
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeignIdFor(Etudiant::class);
            $table->dropForeignIdFor(Employee::class);
        });
    }
};

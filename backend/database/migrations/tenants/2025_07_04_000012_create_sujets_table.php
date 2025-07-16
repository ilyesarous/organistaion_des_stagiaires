<?php

use App\Models\Employee;
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
        Schema::create('sujets', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('competences');
            $table->integer('duree'); // Duration in days
            $table->integer('nbEtudiants'); // Number of students
            $table->enum('typeStage', ['stage', 'projet', 'par annee']); 
            $table->timestamps();
        });
        Schema::table('sujets', function (Blueprint $table) {
            // $table->foreignIdFor(Societe::class) // Use foreignIdFor for better readability
            //     ->constrained('societes');
            $table->foreignIdFor(Employee::class)// Nullable in case the subject is not assigned to an employee yet
                ->constrained('employees');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sujets');
    }
};

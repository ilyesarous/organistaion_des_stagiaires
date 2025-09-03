<?php

use App\Models\Employee;
use App\Models\StatusStage;
use App\Models\TypeStage;
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
            $table->date('date_debut');
            $table->date('date_fin');
            $table->text('competences');
            $table->integer('duree'); // Duration in days
            $table->integer('nbEtudiants'); // Number of students
            $table->string('typeStage')->default(TypeStage::PFE->value);
            $table->string('status')->default(StatusStage::PENDING->value);
            $table->string('lien')->nullable();
            $table->timestamps();
        });
        Schema::table('sujets', function (Blueprint $table) {
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

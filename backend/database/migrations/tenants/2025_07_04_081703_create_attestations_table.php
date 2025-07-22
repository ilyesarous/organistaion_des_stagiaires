<?php

use App\Models\Employee;
use App\Models\Etudiant;
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
        Schema::create('attestations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->boolean('isValid')->default(false);
            $table->boolean('isApproved')->default(false);
            $table->timestamps();
        });

        Schema::table('attestations', function(Blueprint $table){
            // $table->foreignIdFor(Societe::class)->constrained('societes');
            $table->foreignIdFor(Etudiant::class)->constrained('etudiants');
            $table->foreignIdFor(Employee::class)->constrained('employees');
            $table->foreignIdFor(Sujet::class)->constrained('sujets');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attestations');
        Schema::table('attestations', function(Blueprint $table){
            $table->dropForeignIdFor(Societe::class);
            $table->dropForeignIdFor(Etudiant::class);
            $table->dropForeignIdFor(Employee::class);
            $table->dropForeignIdFor(Sujet::class);
        });
    }
};

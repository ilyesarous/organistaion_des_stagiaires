<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Actions;
use App\Models\ActionType;
use App\Models\Gestion;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $actions = [];
        foreach (ActionType::cases() as $action) {
            $created = Actions::create([
                'name' => $action->value,
            ]);
            $actions[] = $created; // Store the model with ID
        }

        // Step 2: Create gestions for each name with all action IDs
        $names = ['user', 'facultee', 'societe', 'sujet', 'role'];

        foreach ($names as $name) {
            foreach ($actions as $action) {
                Gestion::create([
                    'name' => $name,
                    'action_id' => $action->id,
                ]);
            }
        }
    }
}

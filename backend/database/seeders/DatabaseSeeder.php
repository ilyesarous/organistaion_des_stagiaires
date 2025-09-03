<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Actions;
use App\Models\ActionType;
use App\Models\Gestion;
use App\Models\Role;
use App\Models\User;
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
        User::create([
            'nom' => 'admin',
            'prenom' => 'admin',
            'CIN'=> '00000000',
            'email' => 'admin@gmail.com',
            'email_verified_at' => now(),
            'password' => 'admin123',
            'phone' => '21503300',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Role::create([
            'name' => 'superAdmin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

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

        // Step 3: Create a superAdmin user and assign all gestions
        $superAdmin = User::where('email', 'admin@gmail.com')->first();
        $role = Role::where('name', 'superAdmin')->first();
        if ($superAdmin) {
            $role->gestions()->attach(Gestion::all());
            $superAdmin->roles()->attach($role);
            $superAdmin->role = $role->name;
            $superAdmin->save();
        }
    }
}

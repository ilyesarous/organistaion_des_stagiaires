<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // roleGate
        Gate::define('superAdmin', function(User $user): bool{
            return $user->hasRole("superAdmin");
        });
        Gate::define('admin', function(User $user): bool{
            return $user->hasRole("admin");
        });
        Gate::define('superAdmin_or_admin', function(User $user): bool{
            return $user->hasRole("superAdmin") || $user->hasRole("admin");
        });
        Gate::define('superAdmin_or_admin_or_HR', function(User $user): bool{
            return $user->hasRole("superAdmin") || $user->hasRole("admin") || $user->hasRole("HR");
        });
        Gate::define('superAdmin_or_admin_or_encadrant', function(User $user): bool{
            return $user->hasRole("superAdmin") || $user->hasRole("admin") || $user->hasRole("encadrant");
        });
        Gate::define('admin_or_encadrant', function(User $user): bool{
            return $user->hasRole("admin") || $user->hasRole("encadrant");
        });
        Gate::define('admin_or_encadrant_or_HR', function(User $user): bool{
            return $user->hasRole("admin") || $user->hasRole("encadrant") || $user->hasRole("HR");
        });
        Gate::define('admin_or_encadrant_or_etudiant', function(User $user): bool{
            return $user->hasRole("admin") || $user->hasRole("encadrant") || $user->hasRole("etudiant");
        });
        Gate::define('HR', function(User $user): bool{
            return $user->hasRole("HR");
        });
        Gate::define('admin_or_HR', function(User $user): bool{
            return $user->hasRole("admin") || $user->hasRole("HR");
        });
        Gate::define('developer', function(User $user): bool{
            return $user->hasRole("developer");
        });
        Gate::define('encadrant', function(User $user): bool{
            return $user->hasRole("encadrant");
        });
        Gate::define('etudiant', function(User $user): bool{
            return $user->hasRole("etudiant");
        });
        //
    }
}

<?php

namespace App\Http\Middleware;

use App\Models\Tenants;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class TenantsMiddleware
{
     public function handle($request, Closure $next)
    {
        $user = Auth::guard('api')->user();
        if ($user && $user->email !== env('ADMIN_EMAIL')) {
            $tenant = Tenants::where('email', $user->email)->first();
            
            if ($tenant) {
                DB::purge('tenant');
                Config::set('database.connections.tenant.database', $tenant->database);
                DB::setDefaultConnection('tenant');
                // echo(Auth::user());
            }
        } else {
            DB::purge('admin');
            DB::setDefaultConnection('admin');
        }
        

        return $next($request);
    }
}
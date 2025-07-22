<?php

namespace App\Http\Middleware;

use App\Models\Employee;
use Closure;
use Illuminate\Support\Facades\Auth;

class EmployerMiddleware
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() && Auth::user()->userable instanceof Employee) {
            return $next($request);
        }

        return $next($request);
    }
}


namespace App\Http\Middleware;

use App\Models\Etudiant;
use Closure;
use Illuminate\Support\Facades\Auth;

class EtudiantMiddleware
{
    public function handle($request, Closure $next)
    {
        if (Auth::check() && Auth::user()->userable instanceof Etudiant) {
            return $next($request);
        }

        return $next($request);
    }
}


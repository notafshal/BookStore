<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    
    protected function redirectTo($request): ?string
    {
        
        if ($request->expectsJson()) {
            return null;
        }

       
        return null;
    }

    protected function unauthenticated($request, array $guards)
    {
        abort(response()->json([
            'message' => 'Unauthenticated.'
        ], 401));
    }
}

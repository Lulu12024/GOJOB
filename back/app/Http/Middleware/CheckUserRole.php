<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();
        
        // Check if user has the required role
        $requiredRoles = explode('|', $role);
        
        if (!in_array($user->role, $requiredRoles)) {
            return response()->json([
                'message' => 'Accès non autorisé pour ce type d\'utilisateur',
            ], 403);
        }
        
        return $next($request);
    }
}
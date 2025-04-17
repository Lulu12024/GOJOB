<?php 

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $requiredSubscription = 'any'): Response
    {
        $user = $request->user();
        
        // Check if user has an active subscription
        $subscription = $user->subscription;
        
        if (!$subscription || !$subscription->is_active) {
            return response()->json([
                'message' => 'Cette fonctionnalité nécessite un abonnement actif',
            ], 403);
        }
        
        // Check if subscription is of required type (if specified)
        if ($requiredSubscription !== 'any') {
            $requiredSubscriptions = explode('|', $requiredSubscription);
            
            if (!in_array($subscription->plan_type, $requiredSubscriptions)) {
                return response()->json([
                    'message' => 'Cette fonctionnalité nécessite un abonnement de type ' . implode(' ou ', $requiredSubscriptions),
                ], 403);
            }
        }
        
        return $next($request);
    }
}

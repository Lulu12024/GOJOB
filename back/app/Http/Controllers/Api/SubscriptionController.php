<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index()
    {
        $user = auth()->user();
        $subscriptions = $user->subscription;
        
        return response()->json([
            'subscription' => $subscriptions,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_type' => 'required|in:basic_pro,standard_pro,premium_pro,apply_ai,apply_ai_pro',
            'billing_cycle' => 'required|in:weekly,monthly',
            'payment_method' => 'required|string',
            'payment_details' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        
        // Check if user already has an active subscription
        $existingSubscription = $user->subscription;
        if ($existingSubscription && $existingSubscription->is_active) {
            return response()->json([
                'message' => 'You already have an active subscription',
                'subscription' => $existingSubscription,
            ], 400);
        }
        
        // Get plan details based on plan type
        $planDetails = $this->getPlanDetails($request->plan_type, $request->billing_cycle);
        
        // Process payment
        $paymentResult = $this->paymentService->processSubscriptionPayment(
            $user->id,
            $planDetails['amount'],
            $request->payment_method,
            $request->payment_details
        );
        
        if (!$paymentResult['success']) {
            return response()->json([
                'message' => 'Payment failed',
                'error' => $paymentResult['error'],
            ], 400);
        }
        
        // Create subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_type' => $request->plan_type,
            'amount' => $planDetails['amount'],
            'billing_cycle' => $request->billing_cycle,
            'starts_at' => now(),
            'expires_at' => $request->billing_cycle === 'weekly' ? now()->addWeek() : now()->addMonth(),
            'is_active' => true,
            'auto_renew' => true,
        ]);
        
        return response()->json([
            'message' => 'Subscription created successfully',
            'subscription' => $subscription,
            'payment' => $paymentResult['payment'],
        ], 201);
    }

    public function show($id)
    {
        $user = auth()->user();
        $subscription = Subscription::where('id', $id)
                                  ->where('user_id', $user->id)
                                  ->firstOrFail();
        
        return response()->json([
            'subscription' => $subscription,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'auto_renew' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $subscription = Subscription::where('id', $id)
                                  ->where('user_id', $user->id)
                                  ->firstOrFail();
        
        $subscription->update([
            'auto_renew' => $request->auto_renew,
        ]);
        
        return response()->json([
            'message' => 'Subscription updated successfully',
            'subscription' => $subscription->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $subscription = Subscription::where('id', $id)
                                  ->where('user_id', $user->id)
                                  ->firstOrFail();
        
        // Cancel subscription (mark as inactive)
        $subscription->update([
            'is_active' => false,
            'auto_renew' => false,
        ]);
        
        return response()->json([
            'message' => 'Subscription cancelled successfully',
        ]);
    }
    
    private function getPlanDetails($planType, $billingCycle)
    {
        $weeklyPlans = [
            'basic_pro' => 24.75,
            'standard_pro' => 44.75,
            'premium_pro' => 74.75,
        ];
        
        $monthlyPlans = [
            'apply_ai' => 29.99,
            'apply_ai_pro' => 49.99,
        ];
        
        if ($billingCycle === 'weekly' && isset($weeklyPlans[$planType])) {
            return [
                'amount' => $weeklyPlans[$planType],
            ];
        } elseif ($billingCycle === 'monthly' && isset($monthlyPlans[$planType])) {
            return [
                'amount' => $monthlyPlans[$planType],
            ];
        }
        
        // Default fallback
        return [
            'amount' => 0,
        ];
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Process a payment for subscription or other services
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function process(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:credit_card,paypal,bank_transfer',
            'payment_details' => 'required',
            'subscription_id' => 'nullable|exists:subscriptions,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userId = auth()->id();

        // Process the payment
        $result = $this->paymentService->processSubscriptionPayment(
            $userId,
            $request->amount,
            $request->payment_method,
            $request->payment_details
        );

        if (!$result['success']) {
            return response()->json([
                'message' => 'Payment failed',
                'error' => $result['error']
            ], 400);
        }

        // Attach subscription_id if provided
        if ($request->has('subscription_id')) {
            $result['payment']->subscription_id = $request->subscription_id;
            $result['payment']->save();
        }

        return response()->json([
            'message' => 'Payment processed successfully',
            'payment' => $result['payment']
        ]);
    }

    /**
     * Get payment history for the authenticated user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function history(Request $request)
    {
        $userId = auth()->id();
        
        // Get payment history from service
        $paymentHistory = $this->paymentService->getUserPaymentHistory($userId);
        
        return response()->json([
            'payment_history' => $paymentHistory
        ]);
    }

    /**
     * Get details for a specific payment
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $userId = auth()->id();
        $payment = Payment::where('id', $id)
                        ->where('user_id', $userId)
                        ->firstOrFail();
        
        return response()->json([
            'payment' => $payment
        ]);
    }

    /**
     * Request a refund for a payment
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function requestRefund($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userId = auth()->id();
        $payment = Payment::where('id', $id)
                        ->where('user_id', $userId)
                        ->where('status', 'completed')
                        ->firstOrFail();
        
        // In a real implementation, you would process the refund with your payment gateway
        // For now, we'll just mark it as refund requested
        $payment->update([
            'status' => 'refund_requested',
            'refund_reason' => $request->reason,
            'refund_requested_at' => now(),
        ]);
        
        return response()->json([
            'message' => 'Refund request submitted successfully',
            'payment' => $payment->fresh()
        ]);
    }
}
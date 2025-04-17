<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Subscription;
use Exception;

class PaymentService
{
    /**
     * Process subscription payment
     *
     * @param int $userId
     * @param float $amount
     * @param string $paymentMethod
     * @param mixed $paymentDetails
     * @return array
     */
    public function processSubscriptionPayment(int $userId, float $amount, string $paymentMethod, $paymentDetails): array
    {
        try {
            // In a real application, you would process the payment with a payment gateway
            // For now, we'll simulate a successful payment
            
            $payment = Payment::create([
                'user_id' => $userId,
                'amount' => $amount,
                'payment_method' => $paymentMethod,
                'transaction_id' => 'tx_' . time() . '_' . uniqid(),
                'status' => 'completed',
                'payment_date' => now(),
            ]);
            
            return [
                'success' => true,
                'payment' => $payment,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
    
    /**
     * Process subscription renewal
     *
     * @param Subscription $subscription
     * @return array
     */
    public function processSubscriptionRenewal(Subscription $subscription): array
    {
        try {
            // In a real application, you would process the renewal with a payment gateway
            // For now, we'll simulate a successful renewal
            
            $payment = Payment::create([
                'user_id' => $subscription->user_id,
                'subscription_id' => $subscription->id,
                'amount' => $subscription->amount,
                'payment_method' => 'automatic_renewal', // This would come from the stored payment method
                'transaction_id' => 'tx_renewal_' . time() . '_' . uniqid(),
                'status' => 'completed',
                'payment_date' => now(),
            ]);
            
            // Update subscription dates
            $subscription->update([
                'starts_at' => now(),
                'expires_at' => $subscription->billing_cycle === 'weekly' ? now()->addWeek() : now()->addMonth(),
            ]);
            
            return [
                'success' => true,
                'payment' => $payment,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
    
    /**
     * Get user payment history
     *
     * @param int $userId
     * @return array
     */
    public function getUserPaymentHistory(int $userId): array
    {
        $payments = Payment::where('user_id', $userId)
                         ->orderBy('payment_date', 'desc')
                         ->get();
        
        return [
            'user_id' => $userId,
            'total_spent' => $payments->sum('amount'),
            'payment_count' => $payments->count(),
            'payments' => $payments,
        ];
    }
}
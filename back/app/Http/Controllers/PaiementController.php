<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Subscription;
use Stripe\Customer;

class PaiementController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Paiement $paiement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paiement $paiement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paiement $paiement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paiement $paiement)
    {
        //
    }

    public function createPaymentIntent(Request $request)
    {
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount,
                'currency' => 'eur',
                'payment_method_types' => ['card'],
                'metadata' => [
                    'user_id' => $request->user_id,
                ]
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createSubscription(Request $request)
    {
        try {
            // Créer ou récupérer le client Stripe
            $customer = Customer::create([
                'payment_method' => $request->payment_method_id,
                'email' => $request->email,
            ]);

            // Créer l'abonnement
            $subscription = Subscription::create([
                'customer' => $customer->id,
                'items' => [[
                    'price' => $request->price_id, // ID du prix hebdomadaire configuré dans Stripe
                ]],
                'payment_behavior' => 'default_incomplete',
                'expand' => ['latest_invoice.payment_intent'],
            ]);

            return response()->json([
                'subscriptionId' => $subscription->id,
                'clientSecret' => $subscription->latest_invoice->payment_intent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

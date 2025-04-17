<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Webhook;

class WebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );

            // Gérer les différents types d'événements
            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $paymentIntent = $event->data->object;
                    // Logique pour paiement réussi
                    break;
                case 'payment_intent.payment_failed':
                    $paymentIntent = $event->data->object;
                    // Logique pour paiement échoué
                    break;
                case 'customer.subscription.created':
                    $subscription = $event->data->object;
                    // Logique pour nouvel abonnement
                    break;
                case 'customer.subscription.deleted':
                    $subscription = $event->data->object;
                    // Logique pour abonnement annulé
                    break;
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'plan_type' => 'required|in:basic_pro,standard_pro,premium_pro,apply_ai,apply_ai_pro',
            'billing_cycle' => 'required|in:weekly,monthly',
            'payment_method' => 'required|string',
            'payment_details' => 'required',
            'auto_renew' => 'boolean',
        ];
    }
}
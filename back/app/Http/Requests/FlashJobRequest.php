<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FlashJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'employer';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'job_id' => 'required|exists:jobs,id',
            'start_time' => 'required|date|after:now',
            'confirmation_required' => 'boolean',
        ];
        
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules = [
                'start_time' => 'date|after:now',
                'confirmation_required' => 'boolean',
            ];
        }
        
        return $rules;
    }
}
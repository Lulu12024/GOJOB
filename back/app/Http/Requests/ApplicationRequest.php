<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'candidate';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'job_id' => 'required|exists:jobs,id',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'motivation_letter' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'custom_answers' => 'nullable|array',
        ];
    }
}
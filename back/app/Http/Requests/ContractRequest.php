<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContractRequest extends FormRequest
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
            'candidate_id' => 'nullable|exists:users,id',
            'template' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ];
        
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules = [
                'candidate_id' => 'nullable|exists:users,id',
                'template' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
                'status' => 'nullable|in:draft,sent,signed,active,terminated',
            ];
        }
        
        return $rules;
    }
}

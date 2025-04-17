<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'subcategory' => 'nullable|string|max:100',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'salary_type' => 'required|in:hourly,monthly',
            'salary_amount' => 'nullable|numeric',
            'contract_type' => 'required|in:CDI,CDD,Freelance,Alternance',
            'is_entry_level' => 'boolean',
            'accepts_working_visa' => 'boolean',
            'accepts_holiday_visa' => 'boolean',
            'accepts_student_visa' => 'boolean',
            'has_accommodation' => 'boolean',
            'accommodation_accepts_children' => 'boolean',
            'accommodation_accepts_dogs' => 'boolean',
            'accommodation_is_accessible' => 'boolean',
            'job_accepts_handicapped' => 'boolean',
            'has_company_car' => 'boolean',
            'experience_years_required' => 'integer|min:0',
            'requires_driving_license' => 'boolean',
            'contact_name' => 'nullable|string|max:100',
            'contact_phone' => 'nullable|string|max:20',
            'contact_methods' => 'required|array|min:1|max:4',
            'contact_methods.*' => 'in:call,message,apply,website',
            'website_url' => 'nullable|url',
            'is_urgent' => 'boolean',
            'is_top' => 'boolean',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
        
        // Si c'est une mise à jour, certains champs ne sont pas obligatoires
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules = array_merge($rules, [
                'title' => 'string|max:255',
                'description' => 'string',
                'category' => 'string|max:100',
                'city' => 'string|max:100',
                'salary_type' => 'in:hourly,monthly',
                'contract_type' => 'in:CDI,CDD,Freelance,Alternance',
                'contact_methods' => 'array|min:1|max:4',
                'remove_photo_ids' => 'nullable|array',
                'remove_photo_ids.*' => 'integer|exists:job_photos,id',
                'status' => 'in:active,closed,draft',
            ]);
        }
        
        return $rules;
    }
}

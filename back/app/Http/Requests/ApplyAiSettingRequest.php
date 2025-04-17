<?php 

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplyAiSettingRequest extends FormRequest
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
        $rules = [
            'categories' => 'required|array',
            'categories.*' => 'string',
            'salary_min' => 'nullable|numeric',
            'salary_max' => 'nullable|numeric|gte:salary_min',
            'excluded_companies' => 'nullable|array',
            'excluded_companies.*' => 'string',
            'filters' => 'nullable|array',
            'filters.*' => 'in:accommodation,company_car,accepts_working_visa,accepts_holiday_visa,accepts_student_visa',
            'notification_time' => 'required|date_format:H:i',
            'is_active' => 'boolean',
        ];
        
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules = array_merge($rules, [
                'categories' => 'array',
                'notification_time' => 'date_format:H:i',
            ]);
        }
        
        return $rules;
    }
}

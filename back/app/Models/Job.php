<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'title',
        'description',
        'category',
        'subcategory',
        'city',
        'address',
        'salary_type', // 'hourly' ou 'monthly'
        'salary_amount',
        'contract_type', // 'CDI', 'CDD', 'Freelance', 'Alternance'
        'is_entry_level',
        'accepts_working_visa',
        'accepts_holiday_visa',
        'accepts_student_visa',
        'has_accommodation',
        'accommodation_accepts_children',
        'accommodation_accepts_dogs',
        'accommodation_is_accessible',
        'job_accepts_handicapped',
        'has_company_car',
        'experience_years_required',
        'requires_driving_license',
        'contact_name',
        'contact_phone',
        'contact_methods', // JSON array ['call', 'message', 'apply', 'website']
        'website_url',
        'is_urgent',
        'is_new',
        'is_top',
        'status', // 'active', 'closed', 'draft'
        'expires_at',
        'views_count',
        'applications_count',
        'conversion_rate',
    ];

    protected $casts = [
        'contact_methods' => 'array',
        'expires_at' => 'datetime',
    ];

    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function photos()
    {
        return $this->hasMany(JobPhoto::class);
    }

    public function favoredBy()
    {
        return $this->belongsToMany(User::class, 'favorites', 'job_id', 'user_id');
    }

    public function statistics()
    {
        return $this->hasMany(Statistic::class);
    }

    public function contract()
    {
        return $this->hasOne(Contract::class);
    }

    public function isFlashJob()
    {
        return $this->hasOne(FlashJob::class)->exists();
    }
}
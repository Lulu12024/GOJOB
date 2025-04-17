<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    protected $fillable = [
        'title',
        'category',
        'description',
        'photos',
        'working_rights',
        'accommodation_options',
        'contact_name',
        'location',
        'phone_number',
        'cdi',
        'cdd',
        'alternance',
        'freelance',
        'is_hourly',
        'is_monthly',
        'hourly_rate',
        'monthly_rate',
        'gojobs_messaging',
        'call',
        'apply',
        'website_redirect',
        'phone_numbers',
        'custom_question_1',
        'custom_question_2',
        'contract_images',
        'selected_option',
        'total',
        'start_date',
        'end_date',
        'auto_renew',
        'promo_code',
        'is_active',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

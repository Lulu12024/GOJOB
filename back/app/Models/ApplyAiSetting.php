<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplyAiSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'categories', // JSON array of job categories
        'salary_min',
        'salary_max',
        'excluded_companies', // JSON array of companies to exclude
        'filters', // JSON array of filters like 'accommodation', 'company_car'
        'notification_time',
        'is_active',
    ];

    protected $casts = [
        'categories' => 'array',
        'excluded_companies' => 'array',
        'filters' => 'array',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
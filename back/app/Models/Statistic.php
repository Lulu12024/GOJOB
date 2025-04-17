<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'date',
        'views',
        'applications',
        'conversion_rate',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}
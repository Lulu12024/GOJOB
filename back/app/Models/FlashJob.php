<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'start_time',
        'is_confirmed',
        'confirmation_required',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'is_confirmed' => 'boolean',
        'confirmation_required' => 'boolean',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}


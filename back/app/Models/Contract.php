<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'employer_id',
        'candidate_id',
        'template_url',
        'signed_url',
        'status', // 'draft', 'sent', 'signed', 'active', 'terminated'
        'signed_at',
        'start_date',
        'end_date',
        'bank_details',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
        'bank_details' => 'array',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
}

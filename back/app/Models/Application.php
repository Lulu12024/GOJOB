<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'candidate_id',
        'cv_url',
        'motivation_letter_url',
        'status', // 'pending', 'accepted', 'rejected', 'on_hold'
        'is_read',
        'custom_answers', // JSON field for custom questions
    ];

    protected $casts = [
        'custom_answers' => 'array',
        'is_read' => 'boolean',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id',
        'photo_url',
        'order',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'phone',
    //     'password',
    //     'otp',
    //     'otp_expired_at',
    //     'role'
    // ];
    
    // public function jobOffers()
    // {
    //     return $this->hasMany(JobOffer::class);
    // }
    // /**
    //  * The attributes that should be hidden for serialization.
    //  *
    //  * @var list<string>
    //  */
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];

    // /**
    //  * Get the attributes that should be cast.
    //  *
    //  * @return array<string, string>
    //  */
    // protected function casts(): array
    // {
    //     return [
    //         'email_verified_at' => 'datetime',
    //         'password' => 'hashed',
    //     ];
    // }

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role', // 'employer' ou 'candidate'
        'profile_image',
        'bio',
        'address',
        'city',
        'is_handicapped',
        'member_since',
        'has_driving_license',
        'has_vehicle',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function jobs()
    {
        return $this->hasMany(Job::class, 'employer_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'candidate_id');
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(Job::class, 'favorites', 'user_id', 'job_id');
    }

    public function applyAiSettings()
    {
        return $this->hasOne(ApplyAiSetting::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'employer_id');
    }

    public function signedContracts()
    {
        return $this->hasMany(Contract::class, 'candidate_id');
    }
}

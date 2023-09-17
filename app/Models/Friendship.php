<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'accepted_at' => 'datetime',
    ];

    public function requester()
    {
        return $this->hasOne(User::class, 'id', 'requester_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function getFriendsSinceAttribute() {
        if (!empty($this->accepted_at)) {
            return $this->accepted_at->diffForHumans();
        }
        return null;
    }

    public function toArray()
    {
        return [
            'friendship_id' => $this->id,
            'requester' => [
                'id' => $this->requester->id,
                'username' => $this->requester->username,
                'firstName' => $this->requester->firstName,
                'lastName' => $this->requester->lastName,
            ],
            'user' => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'firstName' => $this->user->firstName,
                'lastName' => $this->user->lastName,
            ],
        ];
    }
}

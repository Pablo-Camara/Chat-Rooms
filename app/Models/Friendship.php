<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    use HasFactory;

    public function requester()
    {
        return $this->hasOne(User::class, 'id', 'requester_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
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

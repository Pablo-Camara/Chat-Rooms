<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    const TYPE_CHAT_MESSAGE = 'chat_message';

    const TYPE_FRIEND_REQUEST = 'friend_request';

    public function sender()
    {
        return $this->hasOne(User::class, 'id', 'from_user_id');
    }

    public function receiver()
    {
        return $this->hasOne(User::class, 'id', 'to_user_id');
    }
}

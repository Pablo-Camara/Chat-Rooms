<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatRoomMessage extends Model
{
    protected $fillable = ['client_id', 'message', 'sender_id', 'receiver_id', 'viewed_at'];

    protected $casts = ['viewed_at' => 'datetime', 'sender_id' => 'integer', 'receiver_id' => 'integer'];

    public function chatRoom(): BelongsTo
    {
        return $this->belongsTo(ChatRoom::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ChatRoom extends Model
{
    use HasFactory;

    protected $fillable = ['pair_key', 'title', 'max_users', 'is_private', 'sender_id', 'receiver_id', 'password'];

    protected $casts = ['sender_id' => 'integer', 'receiver_id' => 'integer'];

    protected $hidden = ['password'];

    public function messages(): HasMany
    {
        return $this->hasMany(ChatRoomMessage::class);
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(ChatRoomMessage::class)->latestOfMany();
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function includes(User $user): bool
    {
        return $this->sender_id === $user->id || $this->receiver_id === $user->id;
    }
}

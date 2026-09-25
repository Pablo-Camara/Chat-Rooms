<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Friendship extends Model
{
    protected $fillable = ['pair_key', 'requester_id', 'user_id', 'accepted_at', 'accepted_at_date'];

    protected $casts = ['accepted_at' => 'datetime', 'requester_id' => 'integer', 'user_id' => 'integer'];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

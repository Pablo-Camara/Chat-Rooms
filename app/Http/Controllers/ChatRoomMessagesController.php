<?php

namespace App\Http\Controllers;

use App\Events\ChatMessageSent;
use App\Events\ChatMessageViewed;
use App\Http\Resources\MessageResource;
use App\Models\ChatRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ChatRoomMessagesController extends Controller
{
    public function index(Request $request, ChatRoom $room)
    {
        Gate::authorize('view', $room);
        $data = $request->validate(['before' => ['sometimes', 'integer', 'min:1']]);
        $messages = $room->messages()
            ->when(isset($data['before']), fn ($query) => $query->where('id', '<', $data['before']))
            ->orderByDesc('id')->limit(51)->get();

        return response()->json([
            'data' => MessageResource::collection($messages->take(50)->reverse()->values()),
            'has_more' => $messages->count() > 50,
        ]);
    }

    public function store(Request $request, ChatRoom $room)
    {
        Gate::authorize('send', $room);
        $data = $request->validate(['body' => ['required', 'string', 'max:255'], 'client_id' => ['required', 'uuid']]);
        $sender = $request->user();
        $message = DB::transaction(function () use ($room, $sender, $data) {
            $message = $room->messages()->firstOrCreate([
                'sender_id' => $sender->id,
                'client_id' => $data['client_id'],
            ], [
                'message' => $data['body'],
                'sender_id' => $sender->id,
                'receiver_id' => $room->sender_id === $sender->id ? $room->receiver_id : $room->sender_id,
            ]);
            if ($message->wasRecentlyCreated) {
                $room->touch();
            }

            return $message;
        });

        // The message is durable before broadcasting. A socket outage must not turn
        // a successful send into a retry that inserts the same message twice.
        try {
            if ($message->wasRecentlyCreated) {
                event(new ChatMessageSent($message));
            }
        } catch (\Throwable $exception) {
            report($exception);
        }

        return (new MessageResource($message))->response()->setStatusCode($message->wasRecentlyCreated ? 201 : 200);
    }

    public function read(Request $request, ChatRoom $room)
    {
        Gate::authorize('view', $room);
        $data = $request->validate(['through_id' => ['required', 'integer', 'min:1']]);
        $changed = $room->messages()->where('receiver_id', $request->user()->id)
            ->where('id', '<=', $data['through_id'])->whereNull('viewed_at')->update(['viewed_at' => now()]);

        if ($changed) {
            try {
                event(new ChatMessageViewed($room->id));
            } catch (\Throwable $exception) {
                report($exception);
            }
        }

        return response()->noContent();
    }
}

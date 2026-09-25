<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageResource;
use App\Http\Resources\UserResource;
use App\Models\ChatRoom;
use App\Models\User;
use App\Services\ChatRoomService;
use Illuminate\Http\Request;

class ChatRoomsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $rooms = ChatRoom::query()
            ->where(fn ($query) => $query->where('sender_id', $user->id)->orWhere('receiver_id', $user->id))
            ->with(['sender', 'receiver', 'latestMessage'])
            ->withCount(['messages as unread_count' => fn ($query) => $query->where('receiver_id', $user->id)->whereNull('viewed_at')])
            ->orderByDesc('updated_at')->orderByDesc('id')->paginate(30);

        return $rooms->through(fn ($room) => [
            'id' => $room->id,
            'person' => new UserResource($room->sender_id === $user->id ? $room->receiver : $room->sender),
            'last_message' => $room->latestMessage ? new MessageResource($room->latestMessage) : null,
            'unread_count' => $room->unread_count,
        ]);
    }

    public function store(Request $request, ChatRoomService $rooms)
    {
        $data = $request->validate(['user_id' => ['required', 'integer', 'exists:users,id']]);
        $person = User::findOrFail($data['user_id']);
        $room = $rooms->between($request->user(), $person);

        return response()->json(['id' => $room->id, 'person' => new UserResource($person)]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;

class FriendshipsController extends Controller
{
    public function index(Request $request)
    {
        $id = $request->user()->id;

        return Friendship::where(fn ($query) => $query->where('requester_id', $id)->orWhere('user_id', $id))
            ->with(['requester', 'user'])->orderByDesc('id')->paginate(30)
            ->through(fn ($friendship) => [
                'id' => $friendship->id,
                'person' => new UserResource($friendship->requester_id === $id ? $friendship->user : $friendship->requester),
                'status' => $friendship->accepted_at ? 'accepted' : ($friendship->requester_id === $id ? 'sent' : 'received'),
            ]);
    }

    public function store(Request $request, User $user)
    {
        $sender = $request->user();
        abort_if($sender->is($user), 422, 'You cannot send yourself a contact request.');
        $friendship = Friendship::firstOrCreate(
            ['pair_key' => min($sender->id, $user->id).':'.max($sender->id, $user->id)],
            ['requester_id' => $sender->id, 'user_id' => $user->id],
        );

        return response()->json(['id' => $friendship->id], $friendship->wasRecentlyCreated ? 201 : 200);
    }

    public function accept(Request $request, Friendship $friendship)
    {
        abort_unless($friendship->user_id === $request->user()->id, 403);
        if (! $friendship->accepted_at) {
            $friendship->update(['accepted_at' => now(), 'accepted_at_date' => today()]);
        }

        return response()->noContent();
    }

    public function destroy(Request $request, Friendship $friendship)
    {
        abort_unless(in_array($request->user()->id, [$friendship->requester_id, $friendship->user_id], true), 403);
        $friendship->delete();

        return response()->noContent();
    }
}

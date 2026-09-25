<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate(['search' => ['nullable', 'string', 'max:80']]);
        $search = $data['search'] ?? '';
        $users = User::where('id', '!=', $request->user()->id)
            ->when($search !== '', function ($query) use ($search) {
                // Escape LIKE wildcards; searching for '%' must not enumerate every user.
                $needle = str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $search).'%';
                $query->where(fn ($query) => $query->whereRaw("username LIKE ? ESCAPE '!'", [$needle])
                    ->orWhereRaw("firstName LIKE ? ESCAPE '!'", [$needle])
                    ->orWhereRaw("lastName LIKE ? ESCAPE '!'", [$needle]));
            })
            ->orderBy('username')->paginate(20);

        return UserResource::collection($users);
    }
}

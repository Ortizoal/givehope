<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Cause;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'total_donations' => Donation::where('status', 'completed')->count(),
            'total_raised' => Donation::where('status', 'completed')->sum('amount'),
            'active_causes' => Cause::where('status', 'active')->count(),
            'total_users' => User::where('role', 'user')->count(),
            'recent_donations' => Donation::with(['user', 'cause'])
                ->where('status', 'completed')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    public function listUsers()
    {
        $users = User::where('role', 'user')->latest()->get();
        return response()->json($users);
    }

    public function toggleUser(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot modify admin users'], 403);
        }
        $user->update(['is_active' => !$user->is_active]);
        return response()->json($user);
    }
}

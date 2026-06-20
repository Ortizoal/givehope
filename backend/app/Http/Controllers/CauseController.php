<?php

namespace App\Http\Controllers;

use App\Models\Cause;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CauseController extends Controller
{
    public function index()
    {
        $causes = Cause::where('status', 'active')->latest()->get();
        return response()->json($causes);
    }

    public function show(string $slug)
    {
        $cause = Cause::where('slug', $slug)->firstOrFail();
        return response()->json($cause);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|url',
            'goal_amount' => 'required|numeric|min:1',
            'status' => 'in:active,paused,completed',
        ]);

        $data['slug'] = Str::slug($data['title']);

        $cause = Cause::create($data);
        return response()->json($cause, 201);
    }

    public function update(Request $request, Cause $cause)
    {
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'image_url' => 'nullable|url',
            'goal_amount' => 'sometimes|numeric|min:1',
            'status' => 'sometimes|in:active,paused,completed',
        ]);

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $cause->update($data);
        return response()->json($cause);
    }

    public function destroy(Cause $cause)
    {
        $cause->delete();
        return response()->json(['message' => 'Cause deleted']);
    }

    public function adminIndex()
    {
        return response()->json(Cause::latest()->get());
    }
}

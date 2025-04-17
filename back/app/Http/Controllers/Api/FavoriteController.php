<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Job;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $favorites = $user->favorites()->with('employer')->get();
        
        return response()->json([
            'favorites' => $favorites,
        ]);
    }

    public function toggle($jobId)
    {
        $user = auth()->user();
        $job = Job::findOrFail($jobId);
        
        $favorite = Favorite::where('user_id', $user->id)
                          ->where('job_id', $job->id)
                          ->first();
        
        if ($favorite) {
            $favorite->delete();
            $isFavorite = false;
            $message = 'Job removed from favorites';
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'job_id' => $job->id,
            ]);
            $isFavorite = true;
            $message = 'Job added to favorites';
        }
        
        return response()->json([
            'message' => $message,
            'is_favorite' => $isFavorite,
        ]);
    }
}   
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Notification::where('user_id', $user->id);
        
        // Filter by read status if specified
        if ($request->has('is_read')) {
            $query->where('is_read', $request->is_read);
        }
        
        // Filter by type if specified
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        
        $notifications = $query->orderBy('created_at', 'desc')
                            ->paginate($request->input('per_page', 20));
        
        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead($id)
    {
        $user = auth()->user();
        $notification = Notification::where('id', $id)
                                  ->where('user_id', $user->id)
                                  ->firstOrFail();
        
        $notification->update(['is_read' => true]);
        
        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification,
        ]);
    }

    public function markAllAsRead()
    {
        $user = auth()->user();
        Notification::where('user_id', $user->id)
                  ->where('is_read', false)
                  ->update(['is_read' => true]);
        
        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }
}

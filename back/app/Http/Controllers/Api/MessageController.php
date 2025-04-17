<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Get conversations with latest message
        $conversations = Message::where('sender_id', $user->id)
                              ->orWhere('receiver_id', $user->id)
                              ->orderBy('created_at', 'desc')
                              ->get()
                              ->groupBy(function ($message) use ($user) {
                                  return $message->sender_id === $user->id 
                                        ? $message->receiver_id 
                                        : $message->sender_id;
                              })
                              ->map(function ($messages) {
                                  $latestMessage = $messages->first();
                                  $unreadCount = $messages->where('is_read', false)
                                                        ->where('receiver_id', auth()->id())
                                                        ->count();
                                  
                                  return [
                                      'latest_message' => $latestMessage,
                                      'unread_count' => $unreadCount,
                                  ];
                              });
        
        // Load user details for each conversation
        $conversationsWithUsers = [];
        foreach ($conversations as $userId => $conversationData) {
            $otherUser = User::find($userId);
            
            if ($otherUser) {
                $conversationsWithUsers[] = [
                    'user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'profile_image' => $otherUser->profile_image,
                    ],
                    'latest_message' => $conversationData['latest_message'],
                    'unread_count' => $conversationData['unread_count'],
                ];
            }
        }
        
        return response()->json([
            'conversations' => collect($conversationsWithUsers)->sortByDesc('latest_message.created_at')->values(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id',
            'job_id' => 'nullable|exists:jobs,id',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $senderId = auth()->id();
        $receiverId = $request->receiver_id;
        
        // Prevent sending message to self
        if ($senderId === $receiverId) {
            return response()->json([
                'message' => 'You cannot send a message to yourself',
            ], 400);
        }
        
        $message = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'job_id' => $request->job_id,
            'content' => $request->content,
            'is_read' => false,
        ]);
        
        // Notify receiver of new message
        $this->notificationService->notifyUserOfNewMessage($receiverId, $senderId, $message->id);
        
        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message,
        ], 201);
    }

    public function show($id)
    {
        $user = auth()->user();
        $otherUser = User::findOrFail($id);
        
        // Get conversation messages between two users
        $messages = Message::where(function ($query) use ($user, $otherUser) {
                        $query->where('sender_id', $user->id)
                              ->where('receiver_id', $otherUser->id);
                    })
                    ->orWhere(function ($query) use ($user, $otherUser) {
                        $query->where('sender_id', $otherUser->id)
                              ->where('receiver_id', $user->id);
                    })
                    ->orderBy('created_at', 'asc')
                    ->get();
        
        // Mark unread messages as read
        Message::where('sender_id', $otherUser->id)
              ->where('receiver_id', $user->id)
              ->where('is_read', false)
              ->update(['is_read' => true]);
        
        return response()->json([
            'other_user' => [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
                'profile_image' => $otherUser->profile_image,
            ],
            'messages' => $messages,
        ]);
    }

    public function conversations()
    {
        $user = auth()->user();
        
        // Get all users the current user has exchanged messages with
        $userIds = Message::where('sender_id', $user->id)
                        ->orWhere('receiver_id', $user->id)
                        ->get(['sender_id', 'receiver_id'])
                        ->map(function ($message) use ($user) {
                            return $message->sender_id == $user->id 
                                  ? $message->receiver_id 
                                  : $message->sender_id;
                        })
                        ->unique()
                        ->values();
        
        $users = User::whereIn('id', $userIds)->get(['id', 'name', 'profile_image']);
        
        // For each user, get the latest message and unread count
        $conversationsData = [];
        foreach ($users as $otherUser) {
            $latestMessage = Message::where(function ($query) use ($user, $otherUser) {
                                $query->where('sender_id', $user->id)
                                      ->where('receiver_id', $otherUser->id);
                            })
                            ->orWhere(function ($query) use ($user, $otherUser) {
                                $query->where('sender_id', $otherUser->id)
                                      ->where('receiver_id', $user->id);
                            })
                            ->latest()
                            ->first();
            
            $unreadCount = Message::where('sender_id', $otherUser->id)
                                ->where('receiver_id', $user->id)
                                ->where('is_read', false)
                                ->count();
            
            $conversationsData[] = [
                'user' => $otherUser,
                'latest_message' => $latestMessage,
                'unread_count' => $unreadCount,
            ];
        }
        
        // Sort by latest message timestamp
        usort($conversationsData, function ($a, $b) {
            return $b['latest_message']->created_at <=> $a['latest_message']->created_at;
        });
        
        return response()->json([
            'conversations' => $conversationsData,
        ]);
    }
}

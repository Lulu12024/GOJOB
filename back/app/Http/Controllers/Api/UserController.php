<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    protected $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function index()
    {
        // Only admin should access this
        return response()->json([
            'message' => 'Unauthorized',
        ], 403);
    }

    public function show($id)
    {
        $user = auth()->user();
        
        // Users can only view their own profile
        if ($user->id != $id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
        
        return response()->json([
            'user' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();
        
        // Users can only update their own profile
        if ($user->id != $id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bio' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'is_handicapped' => 'boolean',
            'has_driving_license' => 'boolean',
            'has_vehicle' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['password', 'profile_image']);
        
        // Update password if provided
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }
        
        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            $profileImageUrl = $this->fileUploadService->uploadProfileImage($request->file('profile_image'), $user->id);
            $data['profile_image'] = $profileImageUrl;
            
            // Delete old profile image if exists
            if ($user->profile_image) {
                $this->fileUploadService->deleteProfileImage($user->profile_image);
            }
        }
        
        $user->update($data);
        
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    public function updateProfile(Request $request, $id)
    {
        $user = auth()->user();
        
        // Users can only update their own profile
        if ($user->id != $id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
        
        // Validate based on user role
        if ($user->role === 'employer') {
            $validator = Validator::make($request->all(), [
                'company_name' => 'nullable|string|max:255',
                'company_description' => 'nullable|string',
                'company_website' => 'nullable|url',
                'company_size' => 'nullable|string',
                'company_industry' => 'nullable|string',
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'skills' => 'nullable|array',
                'skills.*' => 'string',
                'experience' => 'nullable|array',
                'experience.*' => 'string',
                'education' => 'nullable|array',
                'education.*' => 'string',
                'languages' => 'nullable|array',
                'languages.*' => 'string',
                'job_preferences' => 'nullable|array',
            ]);
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update profile details
        $profileData = $request->all();
        $user->update($profileData);
        
        return response()->json([
            'message' => 'Profile details updated successfully',
            'user' => $user->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        
        // Users can only delete their own account
        if ($user->id != $id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }
        
        try {
            // Delete profile image if exists
            if ($user->profile_image) {
                $this->fileUploadService->deleteProfileImage($user->profile_image);
            }
            
            // Delete user account
            $user->delete();
            
            return response()->json([
                'message' => 'Account deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete account',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
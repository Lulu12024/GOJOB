<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        Log::debug('Début de la tentative d\'inscription');
        Log::info('Register attempt', ['request_data' => $request->except('password')]);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:employer,candidate',
        ]);

        if ($validator->fails()) {
            Log::debug('Register validation failed', ['errors' => $validator->errors()->toArray()]);
            Log::warning('Register validation failed', ['errors' => $validator->errors()->toArray()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => $request->role,
                'member_since' => now()->year,
            ]);
            Log::debug('Utilisateur créé avec succès', ['user_id' => $user->id]);
            Log::info('User created successfully', ['user_id' => $user->id, 'email' => $user->email]);
            
            $token = $user->createToken('auth_token')->plainTextToken;
            Log::info('Token created for user', ['user_id' => $user->id]);
            Log::debug('Token created for user', ['user_id' => $user->id]);

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Registration error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        Log::info('Login attempt', ['email' => $request->email]);
        
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::warning('Login validation failed', ['errors' => $validator->errors()->toArray()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                Log::warning('Invalid login credentials', ['email' => $request->email]);
                return response()->json([
                    'message' => 'Invalid login credentials',
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();
            Log::info('User authenticated successfully', ['user_id' => $user->id]);
            
            $token = $user->createToken('auth_token')->plainTextToken;
            Log::info('Token created for authenticated user', ['user_id' => $user->id]);

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
            
        } catch (\Exception $e) {
            Log::error('Login error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            Log::info('Logout attempt', ['user_id' => $request->user()->id]);
            
            $request->user()->currentAccessToken()->delete();
            Log::info('User logged out successfully', ['user_id' => $request->user()->id]);

            return response()->json([
                'message' => 'Logged out successfully',
            ]);
            
        } catch (\Exception $e) {
            Log::error('Logout error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user() ? $request->user()->id : 'unknown'
            ]);
            
            return response()->json([
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
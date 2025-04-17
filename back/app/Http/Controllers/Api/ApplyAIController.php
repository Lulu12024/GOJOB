<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ApplyAiSetting;
use App\Models\Job;
use App\Services\ApplyAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApplyAIController extends Controller
{
    protected $applyAIService;

    public function __construct(ApplyAIService $applyAIService)
    {
        $this->applyAIService = $applyAIService;
    }

    public function index()
    {
        $user = auth()->user();
        $settings = $user->applyAiSettings;
        
        return response()->json([
            'apply_ai_settings' => $settings,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'categories' => 'required|array',
            'categories.*' => 'string',
            'salary_min' => 'nullable|numeric',
            'salary_max' => 'nullable|numeric|gte:salary_min',
            'excluded_companies' => 'nullable|array',
            'excluded_companies.*' => 'string',
            'filters' => 'nullable|array',
            'filters.*' => 'in:accommodation,company_car,accepts_working_visa,accepts_holiday_visa,accepts_student_visa',
            'notification_time' => 'required|date_format:H:i',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        
        // Check if user already has ApplyAI settings
        $existingSettings = $user->applyAiSettings;
        if ($existingSettings) {
            return response()->json([
                'message' => 'ApplyAI settings already exist. Please use update instead.',
                'settings' => $existingSettings,
            ], 400);
        }
        
        // Create settings
        $settings = ApplyAiSetting::create([
            'user_id' => $user->id,
            'categories' => $request->categories,
            'salary_min' => $request->salary_min,
            'salary_max' => $request->salary_max,
            'excluded_companies' => $request->excluded_companies,
            'filters' => $request->filters,
            'notification_time' => $request->notification_time,
            'is_active' => $request->is_active ?? true,
        ]);
        
        return response()->json([
            'message' => 'ApplyAI settings created successfully',
            'settings' => $settings,
        ], 201);
    }

    public function show($id)
    {
        $user = auth()->user();
        $settings = ApplyAiSetting::where('id', $id)
                                 ->where('user_id', $user->id)
                                 ->firstOrFail();
        
        return response()->json([
            'apply_ai_settings' => $settings,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'categories' => 'array',
            'categories.*' => 'string',
            'salary_min' => 'nullable|numeric',
            'salary_max' => 'nullable|numeric|gte:salary_min',
            'excluded_companies' => 'nullable|array',
            'excluded_companies.*' => 'string',
            'filters' => 'nullable|array',
            'filters.*' => 'in:accommodation,company_car,accepts_working_visa,accepts_holiday_visa,accepts_student_visa',
            'notification_time' => 'date_format:H:i',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $settings = ApplyAiSetting::where('id', $id)
                                 ->where('user_id', $user->id)
                                 ->firstOrFail();
        
        // Update settings
        $settings->update($request->all());
        
        return response()->json([
            'message' => 'ApplyAI settings updated successfully',
            'settings' => $settings->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $settings = ApplyAiSetting::where('id', $id)
                                 ->where('user_id', $user->id)
                                 ->firstOrFail();
        
        $settings->delete();
        
        return response()->json([
            'message' => 'ApplyAI settings deleted successfully',
        ]);
    }

    public function suggestions()
    {
        $user = auth()->user();
        $settings = $user->applyAiSettings;
        
        if (!$settings) {
            return response()->json([
                'message' => 'No ApplyAI settings found. Please set up ApplyAI first.',
            ], 400);
        }
        
        // Get job suggestions based on user settings
        $suggestions = $this->applyAIService->getJobSuggestions($user->id);
        
        return response()->json([
            'suggestions' => $suggestions,
        ]);
    }

    public function applyToJob($jobId)
    {
        $user = auth()->user();
        $job = Job::findOrFail($jobId);
        
        // Check if user has ApplyAI settings
        $settings = $user->applyAiSettings;
        if (!$settings) {
            return response()->json([
                'message' => 'No ApplyAI settings found. Please set up ApplyAI first.',
            ], 400);
        }
        
        // Apply to job using AI
        $result = $this->applyAIService->applyToJob($user->id, $job->id);
        
        if (!$result['success']) {
            return response()->json([
                'message' => 'Failed to apply to job',
                'error' => $result['error'],
            ], 400);
        }
        
        return response()->json([
            'message' => 'Successfully applied to job using ApplyAI',
            'application' => $result['application'],
        ]);
    }
}
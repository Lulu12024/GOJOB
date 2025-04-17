<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FlashJob;
use App\Models\Job;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FlashJobController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index()
    {
        $flashJobs = FlashJob::with(['job' => function ($query) {
                            $query->where('status', 'active');
                        }])
                        ->whereHas('job', function ($query) {
                            $query->where('status', 'active');
                        })
                        ->where('start_time', '>=', now())
                        ->orderBy('start_time')
                        ->get();
        
        return response()->json([
            'flash_jobs' => $flashJobs,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_id' => 'required|exists:jobs,id',
            'start_time' => 'required|date|after:now',
            'confirmation_required' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $job = Job::findOrFail($request->job_id);
        
        // Check if user is the employer
        if ($job->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to create flash job for this job',
            ], 403);
        }
        
        // Check if job already has a flash job
        $existingFlashJob = FlashJob::where('job_id', $job->id)->first();
        if ($existingFlashJob) {
            return response()->json([
                'message' => 'This job already has a flash job',
                'flash_job' => $existingFlashJob,
            ], 400);
        }
        
        // Create flash job
        $flashJob = FlashJob::create([
            'job_id' => $job->id,
            'start_time' => $request->start_time,
            'confirmation_required' => $request->confirmation_required ?? true,
            'is_confirmed' => false,
        ]);
        
        // Set job as urgent
        $job->update(['is_urgent' => true]);
        
        // Notify relevant candidates
        $this->notificationService->notifyUsersOfFlashJob($job->id, $job->category);
        
        return response()->json([
            'message' => 'Flash job created successfully',
            'flash_job' => $flashJob->load('job'),
        ], 201);
    }

    public function show($id)
    {
        $flashJob = FlashJob::with('job.employer')->findOrFail($id);
        
        return response()->json([
            'flash_job' => $flashJob,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'start_time' => 'date|after:now',
            'confirmation_required' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $flashJob = FlashJob::with('job')->findOrFail($id);
        
        // Check if user is the employer
        if ($flashJob->job->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to update this flash job',
            ], 403);
        }
        
        $flashJob->update($request->only(['start_time', 'confirmation_required']));
        
        return response()->json([
            'message' => 'Flash job updated successfully',
            'flash_job' => $flashJob->fresh()->load('job'),
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $flashJob = FlashJob::with('job')->findOrFail($id);
        
        // Check if user is the employer
        if ($flashJob->job->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this flash job',
            ], 403);
        }
        
        $flashJob->delete();
        
        // Remove urgent flag from job if no other flash jobs
        if (!FlashJob::where('job_id', $flashJob->job_id)->exists()) {
            $flashJob->job->update(['is_urgent' => false]);
        }
        
        return response()->json([
            'message' => 'Flash job deleted successfully',
        ]);
    }

    public function apply(Request $request, $id)
    {
        $user = auth()->user();
        $flashJob = FlashJob::with('job')->findOrFail($id);
        
        // Check if user is a candidate
        if ($user->role !== 'candidate') {
            return response()->json([
                'message' => 'Only candidates can apply for flash jobs',
            ], 403);
        }
        
        // Check if the flash job is still available
        if ($flashJob->start_time < now()) {
            return response()->json([
                'message' => 'This flash job has already started',
            ], 400);
        }
        
        // Create an application for the job
        $applicationController = app(ApplicationController::class);
        $applicationRequest = new Request([
            'job_id' => $flashJob->job_id,
        ]);
        
        $response = $applicationController->store($applicationRequest);
        $responseData = json_decode($response->getContent(), true);
        
        if ($response->getStatusCode() !== 201) {
            return $response;
        }
        
        // If confirmation is required, mark the flash job as confirmed
        if ($flashJob->confirmation_required) {
            $flashJob->update(['is_confirmed' => true]);
        }
        
        return response()->json([
            'message' => 'Applied to flash job successfully',
            'application' => $responseData['application'],
            'flash_job' => $flashJob->fresh(),
        ]);
    }
}
<?php 

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\Notification;
use App\Services\FileUploadService;
use App\Services\NotificationService;
use App\Services\StatisticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    protected $fileUploadService;
    protected $notificationService;
    protected $statisticsService;

    public function __construct(
        FileUploadService $fileUploadService,
        NotificationService $notificationService,
        StatisticsService $statisticsService
    ) {
        $this->fileUploadService = $fileUploadService;
        $this->notificationService = $notificationService;
        $this->statisticsService = $statisticsService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        
        if ($user->role === 'employer') {
            // Get applications for employer's jobs
            $query = Application::whereHas('job', function ($q) use ($user) {
                $q->where('employer_id', $user->id);
            })->with(['candidate', 'job']);
            
            // Filter by job if specified
            if ($request->has('job_id')) {
                $query->where('job_id', $request->job_id);
            }
            
            // Filter by status if specified
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            // Filter by read status if specified
            if ($request->has('is_read')) {
                $query->where('is_read', $request->is_read);
            }
            
            return response()->json([
                'applications' => $query->latest()->paginate($request->input('per_page', 10)),
            ]);
        } else {
            // Get candidate's applications
            $query = $user->applications()->with('job.employer');
            
            // Filter by status if specified
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            return response()->json([
                'applications' => $query->latest()->paginate($request->input('per_page', 10)),
            ]);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_id' => 'required|exists:jobs,id',
            'cv' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'motivation_letter' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'custom_answers' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        
        // Check if user is a candidate
        if ($user->role !== 'candidate') {
            return response()->json([
                'message' => 'Only candidates can apply for jobs',
            ], 403);
        }
        
        // Check if job exists and is active
        $job = Job::findOrFail($request->job_id);
        if ($job->status !== 'active') {
            return response()->json([
                'message' => 'This job is no longer accepting applications',
            ], 400);
        }
        
        // Check if user has already applied
        $existingApplication = Application::where('job_id', $job->id)
                                        ->where('candidate_id', $user->id)
                                        ->first();
        if ($existingApplication) {
            return response()->json([
                'message' => 'You have already applied for this job',
                'application' => $existingApplication,
            ], 400);
        }
        
        try {
            // Handle file uploads
            $cvUrl = null;
            if ($request->hasFile('cv')) {
                $cvUrl = $this->fileUploadService->uploadApplicationDocument($request->file('cv'), 'cv');
            }
            
            $motivationLetterUrl = null;
            if ($request->hasFile('motivation_letter')) {
                $motivationLetterUrl = $this->fileUploadService->uploadApplicationDocument($request->file('motivation_letter'), 'motivation');
            }
            
            // Create application
            $application = Application::create([
                'job_id' => $job->id,
                'candidate_id' => $user->id,
                'cv_url' => $cvUrl,
                'motivation_letter_url' => $motivationLetterUrl,
                'custom_answers' => $request->custom_answers,
                'status' => 'pending',
                'is_read' => false,
            ]);
            
            // Update job statistics
            $job->increment('applications_count');
            $conversionRate = ($job->applications_count / $job->views_count) * 100;
            $job->update(['conversion_rate' => $conversionRate]);
            
            // Track application in statistics
            $this->statisticsService->trackJobApplication($job->id);
            
            // Send notification to employer
            $this->notificationService->notifyEmployerOfNewApplication($job->employer_id, $job->id, $user->id);
            
            return response()->json([
                'message' => 'Application submitted successfully',
                'application' => $application,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to submit application',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $user = auth()->user();
        $application = Application::with(['job.employer', 'candidate'])->findOrFail($id);
        
        // Check authorization
        if ($user->role === 'employer' && $application->job->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to view this application',
            ], 403);
        } elseif ($user->role === 'candidate' && $application->candidate_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to view this application',
            ], 403);
        }
        
        // Mark as read if employer is viewing
        if ($user->role === 'employer' && !$application->is_read) {
            $application->update(['is_read' => true]);
        }
        
        return response()->json([
            'application' => $application,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,accepted,rejected,on_hold',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $application = Application::with('job')->findOrFail($id);
        
        // Check if user is the employer of this job
        if ($user->role !== 'employer' || $application->job->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to update this application',
            ], 403);
        }
        
        // Update status
        $application->update([
            'status' => $request->status,
        ]);
        
        // Notify candidate of status change
        $this->notificationService->notifyCandidateOfApplicationStatusChange(
            $application->candidate_id,
            $application->job_id,
            $request->status
        );
        
        return response()->json([
            'message' => 'Application status updated successfully',
            'application' => $application->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $application = Application::findOrFail($id);
        
        // Check authorization
        if ($user->role === 'employer' && $application->job->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this application',
            ], 403);
        } elseif ($user->role === 'candidate' && $application->candidate_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this application',
            ], 403);
        }
        
        try {
            // Delete associated files
            if ($application->cv_url) {
                $this->fileUploadService->deleteApplicationDocument($application->cv_url);
            }
            
            if ($application->motivation_letter_url) {
                $this->fileUploadService->deleteApplicationDocument($application->motivation_letter_url);
            }
            
            $application->delete();
            
            return response()->json([
                'message' => 'Application deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete application',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
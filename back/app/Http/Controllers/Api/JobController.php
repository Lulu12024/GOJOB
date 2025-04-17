<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobPhoto;
use App\Models\Statistic;
use App\Services\FileUploadService;
use App\Services\StatisticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    protected $fileUploadService;
    protected $statisticsService;

    public function __construct(FileUploadService $fileUploadService, StatisticsService $statisticsService)
    {
        $this->fileUploadService = $fileUploadService;
        $this->statisticsService = $statisticsService;
    }

    public function index(Request $request)
    {
        $query = Job::with(['employer', 'photos'])
                    ->where('status', 'active');
        
        // Apply filters if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        
        if ($request->has('contract_type')) {
            $query->where('contract_type', $request->contract_type);
        }
        
        if ($request->has('has_accommodation') && $request->has_accommodation) {
            $query->where('has_accommodation', true);
        }
        
        if ($request->has('accommodation_accepts_children') && $request->accommodation_accepts_children) {
            $query->where('accommodation_accepts_children', true);
        }
        
        if ($request->has('accommodation_accepts_dogs') && $request->accommodation_accepts_dogs) {
            $query->where('accommodation_accepts_dogs', true);
        }
        
        if ($request->has('accommodation_is_accessible') && $request->accommodation_is_accessible) {
            $query->where('accommodation_is_accessible', true);
        }
        
        if ($request->has('job_accepts_handicapped') && $request->job_accepts_handicapped) {
            $query->where('job_accepts_handicapped', true);
        }
        
        if ($request->has('has_company_car') && $request->has_company_car) {
            $query->where('has_company_car', true);
        }
        
        if ($request->has('accepts_working_visa') && $request->accepts_working_visa) {
            $query->where('accepts_working_visa', true);
        }
        
        if ($request->has('accepts_holiday_visa') && $request->accepts_holiday_visa) {
            $query->where('accepts_holiday_visa', true);
        }
        
        if ($request->has('accepts_student_visa') && $request->accepts_student_visa) {
            $query->where('accepts_student_visa', true);
        }
        
        // Sort options
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        if (in_array($sortField, ['created_at', 'title', 'salary_amount', 'city'])) {
            $query->orderBy($sortField, $sortDirection);
        }
        
        // Prioritize urgent/top jobs if not sorting by other criteria
        if ($sortField === 'created_at' && $sortDirection === 'desc') {
            $query->orderByRaw('is_top DESC, is_urgent DESC, is_new DESC');
        }
        
        return response()->json([
            'jobs' => $query->paginate($request->input('per_page', 10)),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'subcategory' => 'nullable|string|max:100',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'salary_type' => 'required|in:hourly,monthly',
            'salary_amount' => 'nullable|numeric',
            'contract_type' => 'required|in:CDI,CDD,Freelance,Alternance',
            'is_entry_level' => 'boolean',
            'accepts_working_visa' => 'boolean',
            'accepts_holiday_visa' => 'boolean',
            'accepts_student_visa' => 'boolean',
            'has_accommodation' => 'boolean',
            'accommodation_accepts_children' => 'boolean',
            'accommodation_accepts_dogs' => 'boolean',
            'accommodation_is_accessible' => 'boolean',
            'job_accepts_handicapped' => 'boolean',
            'has_company_car' => 'boolean',
            'experience_years_required' => 'integer|min:0',
            'requires_driving_license' => 'boolean',
            'contact_name' => 'nullable|string|max:100',
            'contact_phone' => 'nullable|string|max:20',
            'contact_methods' => 'required|array|min:1|max:4',
            'contact_methods.*' => 'in:call,message,apply,website',
            'website_url' => 'nullable|url',
            'is_urgent' => 'boolean',
            'is_top' => 'boolean',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $job = Job::create([
                'employer_id' => auth()->id(),
                'title' => $request->title,
                'description' => $request->description,
                'category' => $request->category,
                'subcategory' => $request->subcategory,
                'city' => $request->city,
                'address' => $request->address,
                'salary_type' => $request->salary_type,
                'salary_amount' => $request->salary_amount,
                'contract_type' => $request->contract_type,
                'is_entry_level' => $request->is_entry_level ?? false,
                'accepts_working_visa' => $request->accepts_working_visa ?? false,
                'accepts_holiday_visa' => $request->accepts_holiday_visa ?? false,
                'accepts_student_visa' => $request->accepts_student_visa ?? false,
                'has_accommodation' => $request->has_accommodation ?? false,
                'accommodation_accepts_children' => $request->accommodation_accepts_children ?? false,
                'accommodation_accepts_dogs' => $request->accommodation_accepts_dogs ?? false,
                'accommodation_is_accessible' => $request->accommodation_is_accessible ?? false,
                'job_accepts_handicapped' => $request->job_accepts_handicapped ?? false,
                'has_company_car' => $request->has_company_car ?? false,
                'experience_years_required' => $request->experience_years_required ?? 0,
                'requires_driving_license' => $request->requires_driving_license ?? false,
                'contact_name' => $request->contact_name,
                'contact_phone' => $request->contact_phone,
                'contact_methods' => $request->contact_methods,
                'website_url' => $request->website_url,
                'is_urgent' => $request->is_urgent ?? false,
                'is_new' => true,
                'is_top' => $request->is_top ?? false,
                'status' => 'active',
                'expires_at' => now()->addDays(30),
            ]);

            // Handle photo uploads
            if ($request->hasFile('photos')) {
                $order = 0;
                foreach ($request->file('photos') as $photo) {
                    $photoUrl = $this->fileUploadService->uploadJobPhoto($photo, $job->id);
                    
                    JobPhoto::create([
                        'job_id' => $job->id,
                        'photo_url' => $photoUrl,
                        'order' => $order++,
                    ]);
                }
            }

            // Initialize statistics for the job
            $this->statisticsService->initializeJobStatistics($job->id);

            DB::commit();

            return response()->json([
                'message' => 'Job created successfully',
                'job' => $job->load('photos'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $job = Job::with(['employer', 'photos'])->findOrFail($id);
        
        // Increment view count
        $job->increment('views_count');
        
        // Track view in statistics
        $this->statisticsService->trackJobView($job->id);
        
        return response()->json([
            'job' => $job,
        ]);
    }

    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);
        
        // Check if user is the employer
        if ($job->employer_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized to update this job',
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'category' => 'string|max:100',
            'subcategory' => 'nullable|string|max:100',
            'city' => 'string|max:100',
            'address' => 'nullable|string|max:255',
            'salary_type' => 'in:hourly,monthly',
            'salary_amount' => 'nullable|numeric',
            'contract_type' => 'in:CDI,CDD,Freelance,Alternance',
            'is_entry_level' => 'boolean',
            'accepts_working_visa' => 'boolean',
            'accepts_holiday_visa' => 'boolean',
            'accepts_student_visa' => 'boolean',
            'has_accommodation' => 'boolean',
            'accommodation_accepts_children' => 'boolean',
            'accommodation_accepts_dogs' => 'boolean',
            'accommodation_is_accessible' => 'boolean',
            'job_accepts_handicapped' => 'boolean',
            'has_company_car' => 'boolean',
            'experience_years_required' => 'integer|min:0',
            'requires_driving_license' => 'boolean',
            'contact_name' => 'nullable|string|max:100',
            'contact_phone' => 'nullable|string|max:20',
            'contact_methods' => 'array|min:1|max:4',
            'contact_methods.*' => 'in:call,message,apply,website',
            'website_url' => 'nullable|url',
            'is_urgent' => 'boolean',
            'is_top' => 'boolean',
            'status' => 'in:active,closed,draft',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_photo_ids' => 'nullable|array',
            'remove_photo_ids.*' => 'integer|exists:job_photos,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $job->update($request->only([
                'title', 'description', 'category', 'subcategory', 'city', 'address',
                'salary_type', 'salary_amount', 'contract_type', 'is_entry_level',
                'accepts_working_visa', 'accepts_holiday_visa', 'accepts_student_visa',
                'has_accommodation', 'accommodation_accepts_children', 'accommodation_accepts_dogs',
                'accommodation_is_accessible', 'job_accepts_handicapped', 'has_company_car',
                'experience_years_required', 'requires_driving_license', 'contact_name',
                'contact_phone', 'contact_methods', 'website_url', 'is_urgent', 'is_top', 'status'
            ]));

            // Remove photos if specified
            if ($request->has('remove_photo_ids') && is_array($request->remove_photo_ids)) {
                foreach ($request->remove_photo_ids as $photoId) {
                    $photo = JobPhoto::where('id', $photoId)
                                ->where('job_id', $job->id)
                                ->first();
                    
                    if ($photo) {
                        $this->fileUploadService->deleteJobPhoto($photo->photo_url);
                        $photo->delete();
                    }
                }
            }

            // Add new photos if provided
            if ($request->hasFile('photos')) {
                $maxOrder = JobPhoto::where('job_id', $job->id)->max('order') ?? -1;
                
                foreach ($request->file('photos') as $photo) {
                    $photoUrl = $this->fileUploadService->uploadJobPhoto($photo, $job->id);
                    
                    JobPhoto::create([
                        'job_id' => $job->id,
                        'photo_url' => $photoUrl,
                        'order' => ++$maxOrder,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Job updated successfully',
                'job' => $job->load('photos'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $job = Job::findOrFail($id);
        
        // Check if user is the employer
        if ($job->employer_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized to delete this job',
            ], 403);
        }
        
        try {
            // Delete job photos from storage
            foreach ($job->photos as $photo) {
                $this->fileUploadService->deleteJobPhoto($photo->photo_url);
            }
            
            $job->delete();
            
            return response()->json([
                'message' => 'Job deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function recommended()
    {
        // Get jobs tailored to the current user based on their search history, 
        // applications, or preferences
        $user = auth()->user();
        
        // Simple recommendation logic based on user's past applications
        if ($user->role === 'candidate') {
            // Get categories from user's past applications
            $appliedCategories = $user->applications()
                                     ->with('job')
                                     ->get()
                                     ->pluck('job.category')
                                     ->unique()
                                     ->toArray();
            
            if (!empty($appliedCategories)) {
                $recommendedJobs = Job::where('status', 'active')
                                     ->whereIn('category', $appliedCategories)
                                     ->orderByRaw('is_top DESC, is_urgent DESC, created_at DESC')
                                     ->limit(10)
                                     ->get();
                                     
                return response()->json([
                    'jobs' => $recommendedJobs,
                ]);
            }
        }
        
        // If no specific recommendations, return some recent jobs
        $recentJobs = Job::where('status', 'active')
                        ->orderByRaw('is_top DESC, is_urgent DESC, created_at DESC')
                        ->limit(10)
                        ->get();
        
        return response()->json([
            'jobs' => $recentJobs,
        ]);
    }
    
    public function search(Request $request)
    {
        $query = Job::with(['employer', 'photos'])
                    ->where('status', 'active');
        
        // Keyword search
        if ($request->has('keyword') && !empty($request->keyword)) {
            $keyword = '%' . $request->keyword . '%';
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', $keyword)
                  ->orWhere('description', 'like', $keyword)
                  ->orWhere('category', 'like', $keyword)
                  ->orWhere('subcategory', 'like', $keyword);
            });
        }
        
        // Location search
        if ($request->has('location') && !empty($request->location)) {
            $location = '%' . $request->location . '%';
            $query->where(function ($q) use ($location) {
                $q->where('city', 'like', $location)
                  ->orWhere('address', 'like', $location);
            });
        }
        
        // Add filters just like in the index method
        // Apply filters if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        if ($request->has('contract_type')) {
            $query->where('contract_type', $request->contract_type);
        }
        
        if ($request->has('has_accommodation') && $request->has_accommodation) {
            $query->where('has_accommodation', true);
        }
        
        if ($request->has('accommodation_accepts_children') && $request->accommodation_accepts_children) {
            $query->where('accommodation_accepts_children', true);
        }
        
        if ($request->has('accommodation_accepts_dogs') && $request->accommodation_accepts_dogs) {
            $query->where('accommodation_accepts_dogs', true);
        }
        
        if ($request->has('accommodation_is_accessible') && $request->accommodation_is_accessible) {
            $query->where('accommodation_is_accessible', true);
        }
        
        if ($request->has('job_accepts_handicapped') && $request->job_accepts_handicapped) {
            $query->where('job_accepts_handicapped', true);
        }
        
        if ($request->has('has_company_car') && $request->has_company_car) {
            $query->where('has_company_car', true);
        }
        
        if ($request->has('accepts_working_visa') && $request->accepts_working_visa) {
            $query->where('accepts_working_visa', true);
        }
        
        if ($request->has('accepts_holiday_visa') && $request->accepts_holiday_visa) {
            $query->where('accepts_holiday_visa', true);
        }
        
        if ($request->has('accepts_student_visa') && $request->accepts_student_visa) {
            $query->where('accepts_student_visa', true);
        }
        
        // Salary filters
        if ($request->has('min_salary') && is_numeric($request->min_salary)) {
            $query->where('salary_amount', '>=', $request->min_salary);
        }
        
        if ($request->has('max_salary') && is_numeric($request->max_salary)) {
            $query->where('salary_amount', '<=', $request->max_salary);
        }
        
        // Experience filter
        if ($request->has('max_experience') && is_numeric($request->max_experience)) {
            $query->where('experience_years_required', '<=', $request->max_experience);
        }
        
        // Sort options
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        if (in_array($sortField, ['created_at', 'title', 'salary_amount', 'city'])) {
            $query->orderBy($sortField, $sortDirection);
        }
        
        // Prioritize urgent/top jobs if not sorting by other criteria
        if ($sortField === 'created_at' && $sortDirection === 'desc') {
            $query->orderByRaw('is_top DESC, is_urgent DESC, is_new DESC');
        }
        
        return response()->json([
            'jobs' => $query->paginate($request->input('per_page', 10)),
        ]);
    }
}

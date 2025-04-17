<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\Statistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function jobStats($jobId)
    {
        $user = auth()->user();
        $job = Job::findOrFail($jobId);
        
        // Check if user is the employer
        if ($job->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to view statistics for this job',
            ], 403);
        }
        
        // Get daily statistics for the last 30 days
        $dailyStats = Statistic::where('job_id', $job->id)
                             ->where('date', '>=', now()->subDays(30))
                             ->orderBy('date')
                             ->get();
        
        // Calculate totals
        $totalViews = $dailyStats->sum('views');
        $totalApplications = $dailyStats->sum('applications');
        $conversionRate = $totalViews > 0 ? ($totalApplications / $totalViews) * 100 : 0;
        
        // Calculate what the stats would be with urgent option
        $urgentMultiplier = 1.5; // Estimated impact of urgent option
        $urgentViews = $totalViews * $urgentMultiplier;
        $urgentApplications = $totalApplications * $urgentMultiplier;
        
        return response()->json([
            'job_id' => $job->id,
            'job_title' => $job->title,
            'total_views' => $totalViews,
            'total_applications' => $totalApplications,
            'conversion_rate' => round($conversionRate, 2),
            'daily_stats' => $dailyStats,
            'urgent_projection' => [
                'views' => round($urgentViews),
                'applications' => round($urgentApplications),
            ],
        ]);
    }

    public function dashboard()
    {
        $user = auth()->user();
        
        if ($user->role !== 'employer') {
            return response()->json([
                'message' => 'Only employers can access the statistics dashboard',
            ], 403);
        }
        
        // Get active jobs count
        $activeJobsCount = Job::where('employer_id', $user->id)
                            ->where('status', 'active')
                            ->count();
        
        // Get total applications count
        $totalApplicationsCount = DB::table('applications')
                                  ->join('jobs', 'applications.job_id', '=', 'jobs.id')
                                  ->where('jobs.employer_id', $user->id)
                                  ->count();
        
        // Get total views count
        $totalViewsCount = Job::where('employer_id', $user->id)
                            ->sum('views_count');
        
        // Get average conversion rate
        $averageConversionRate = Job::where('employer_id', $user->id)
                                ->where('views_count', '>', 0)
                                ->avg(DB::raw('applications_count / views_count * 100'));
        
        // Get top performing jobs
        $topJobs = Job::where('employer_id', $user->id)
                     ->orderBy('applications_count', 'desc')
                     ->limit(5)
                     ->get(['id', 'title', 'views_count', 'applications_count', 'conversion_rate']);
        
        // Get recent applications
        $recentApplications = DB::table('applications')
                             ->join('jobs', 'applications.job_id', '=', 'jobs.id')
                             ->join('users', 'applications.candidate_id', '=', 'users.id')
                             ->where('jobs.employer_id', $user->id)
                             ->orderBy('applications.created_at', 'desc')
                             ->limit(10)
                             ->get([
                                 'applications.id',
                                 'jobs.title as job_title',
                                 'users.name as candidate_name',
                                 'applications.status',
                                 'applications.created_at',
                             ]);
        
        return response()->json([
            'active_jobs_count' => $activeJobsCount,
            'total_applications_count' => $totalApplicationsCount,
            'total_views_count' => $totalViewsCount,
            'average_conversion_rate' => round($averageConversionRate, 2),
            'top_jobs' => $topJobs,
            'recent_applications' => $recentApplications,
        ]);
    }
}
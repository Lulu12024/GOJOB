<?php

namespace App\Services;

use App\Models\Job;
use App\Models\Statistic;
use Carbon\Carbon;

class StatisticsService
{
    /**
     * Initialize job statistics
     *
     * @param int $jobId
     * @return void
     */
    public function initializeJobStatistics(int $jobId): void
    {
        // Create an initial statistics record for today
        Statistic::create([
            'job_id' => $jobId,
            'date' => Carbon::today(),
            'views' => 0,
            'applications' => 0,
            'conversion_rate' => 0,
        ]);
    }
    
    /**
     * Track a job view
     *
     * @param int $jobId
     * @return void
     */
    public function trackJobView(int $jobId): void
    {
        $today = Carbon::today();
        
        // Find or create today's statistics record
        $statistic = Statistic::firstOrCreate(
            ['job_id' => $jobId, 'date' => $today],
            ['views' => 0, 'applications' => 0, 'conversion_rate' => 0]
        );
        
        // Increment views
        $statistic->increment('views');
        
        // Update conversion rate
        if ($statistic->views > 0) {
            $conversionRate = ($statistic->applications / $statistic->views) * 100;
            $statistic->update(['conversion_rate' => $conversionRate]);
        }
    }
    
    /**
     * Track a job application
     *
     * @param int $jobId
     * @return void
     */
    public function trackJobApplication(int $jobId): void
    {
        $today = Carbon::today();
        
        // Find or create today's statistics record
        $statistic = Statistic::firstOrCreate(
            ['job_id' => $jobId, 'date' => $today],
            ['views' => 0, 'applications' => 0, 'conversion_rate' => 0]
        );
        
        // Increment applications
        $statistic->increment('applications');
        
        // Update conversion rate
        if ($statistic->views > 0) {
            $conversionRate = ($statistic->applications / $statistic->views) * 100;
            $statistic->update(['conversion_rate' => $conversionRate]);
        }
    }
    
    /**
     * Get job statistics for a date range
     *
     * @param int $jobId
     * @param Carbon $startDate
     * @param Carbon $endDate
     * @return array
     */
    public function getJobStatistics(int $jobId, Carbon $startDate, Carbon $endDate): array
    {
        $statistics = Statistic::where('job_id', $jobId)
                             ->whereBetween('date', [$startDate, $endDate])
                             ->orderBy('date')
                             ->get();
        
        return [
            'job_id' => $jobId,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'total_views' => $statistics->sum('views'),
            'total_applications' => $statistics->sum('applications'),
            'conversion_rate' => $statistics->sum('views') > 0 
                ? ($statistics->sum('applications') / $statistics->sum('views')) * 100 
                : 0,
            'daily_stats' => $statistics,
        ];
    }
}
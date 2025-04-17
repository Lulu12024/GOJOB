<?php
namespace App\Providers;

use App\Services\ApplyAIService;
use App\Services\FileUploadService;
use App\Services\NotificationService;
use App\Services\PaymentService;
use App\Services\StatisticsService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Enregistrement des services
        $this->app->singleton(FileUploadService::class, function ($app) {
            return new FileUploadService();
        });
        
        $this->app->singleton(NotificationService::class, function ($app) {
            return new NotificationService();
        });
        
        $this->app->singleton(StatisticsService::class, function ($app) {
            return new StatisticsService();
        });
        
        $this->app->singleton(PaymentService::class, function ($app) {
            return new PaymentService();
        });
        
        $this->app->singleton(ApplyAIService::class, function ($app) {
            return new ApplyAIService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
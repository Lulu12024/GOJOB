<?php

use App\Http\Controllers\API\ApplyAIController;
use App\Http\Controllers\API\ApplicationController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ContractController;
use App\Http\Controllers\API\FavoriteController;
use App\Http\Controllers\API\FlashJobController;
use App\Http\Controllers\API\JobController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\StatisticsController;
use App\Http\Controllers\API\SubscriptionController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;


Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    
    // Routes utilisateur
    Route::prefix('users')->group(function () {
        Route::get('profile', [UserController::class, 'show']);
        Route::put('profile', [UserController::class, 'update']);
        Route::put('profile/details', [UserController::class, 'updateProfile']);
    });
    
    // Routes offres d'emploi
    Route::prefix('jobs')->group(function () {
        Route::get('/', [JobController::class, 'index']);
        Route::post('/', [JobController::class, 'store'])->middleware('role:employer');
        Route::get('/recommended', [JobController::class, 'recommended']);
        Route::get('/search', [JobController::class, 'search']);
        Route::get('/{id}', [JobController::class, 'show']);
        Route::put('/{id}', [JobController::class, 'update'])->middleware('role:employer');
        Route::delete('/{id}', [JobController::class, 'destroy'])->middleware('role:employer');
    });
    
    // Routes candidatures
    Route::prefix('applications')->group(function () {
        Route::get('/', [ApplicationController::class, 'index']);
        Route::post('/', [ApplicationController::class, 'store'])->middleware('role:candidate');
        Route::get('/{id}', [ApplicationController::class, 'show']);
        Route::put('/{id}/status', [ApplicationController::class, 'updateStatus'])->middleware('role:employer');
        Route::delete('/{id}', [ApplicationController::class, 'destroy']);
    });
    
    // Routes messages
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index']);
        Route::post('/', [MessageController::class, 'store']);
        Route::get('/conversations', [MessageController::class, 'conversations']);
        Route::get('/{id}', [MessageController::class, 'show']);
    });
    
    // Routes abonnements
    Route::prefix('subscriptions')->group(function () {
        Route::get('/', [SubscriptionController::class, 'index']);
        Route::post('/', [SubscriptionController::class, 'store']);
        Route::get('/{id}', [SubscriptionController::class, 'show']);
        Route::put('/{id}', [SubscriptionController::class, 'update']);
        Route::delete('/{id}', [SubscriptionController::class, 'destroy']);
    });
    
    // Routes paiements
    Route::prefix('payments')->group(function () {
        Route::post('/process', [PaymentController::class, 'process']);
        Route::get('/history', [PaymentController::class, 'history']);
    });
    
    // Routes emplois flash
    Route::prefix('flash-jobs')->group(function () {
        Route::get('/', [FlashJobController::class, 'index']);
        Route::post('/', [FlashJobController::class, 'store'])->middleware('role:employer');
        Route::get('/{id}', [FlashJobController::class, 'show']);
        Route::put('/{id}', [FlashJobController::class, 'update'])->middleware('role:employer');
        Route::delete('/{id}', [FlashJobController::class, 'destroy'])->middleware('role:employer');
        Route::post('/{id}/apply', [FlashJobController::class, 'apply'])->middleware('role:candidate');
    });
    
    // Routes favoris
    Route::prefix('favorites')->group(function () {
        Route::get('/', [FavoriteController::class, 'index']);
        Route::post('/toggle/{job}', [FavoriteController::class, 'toggle']);
    });
    
    // Routes notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/read-all', [NotificationController::class, 'markAllAsRead']);
    });
    
    // Routes statistiques
    Route::prefix('statistics')->group(function () {
        Route::get('/job/{job}', [StatisticsController::class, 'jobStats'])->middleware('role:employer');
        Route::get('/dashboard', [StatisticsController::class, 'dashboard'])->middleware('role:employer');
    });
    
    // Routes contrats
    Route::prefix('contracts')->group(function () {
        Route::get('/', [ContractController::class, 'index']);
        Route::post('/', [ContractController::class, 'store'])->middleware('role:employer');
        Route::get('/{id}', [ContractController::class, 'show']);
        Route::put('/{id}', [ContractController::class, 'update'])->middleware('role:employer');
        Route::delete('/{id}', [ContractController::class, 'destroy'])->middleware('role:employer');
        Route::post('/{id}/sign', [ContractController::class, 'sign'])->middleware('role:candidate');
    });
    
    // Routes ApplyAI
    Route::prefix('apply-ai')->group(function () {
        Route::get('/', [ApplyAIController::class, 'index'])->middleware('role:candidate');
        Route::post('/', [ApplyAIController::class, 'store'])->middleware(['role:candidate', 'subscription:apply_ai|apply_ai_pro']);
        Route::get('/suggestions', [ApplyAIController::class, 'suggestions'])->middleware(['role:candidate', 'subscription:apply_ai|apply_ai_pro']);
        Route::post('/apply/{job}', [ApplyAIController::class, 'applyToJob'])->middleware(['role:candidate', 'subscription:apply_ai|apply_ai_pro']);
        Route::get('/{id}', [ApplyAIController::class, 'show'])->middleware('role:candidate');
        Route::put('/{id}', [ApplyAIController::class, 'update'])->middleware('role:candidate');
        Route::delete('/{id}', [ApplyAIController::class, 'destroy'])->middleware('role:candidate');
    });
});
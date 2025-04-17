<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Notify employer of a new application
     *
     * @param int $employerId
     * @param int $jobId
     * @param int $candidateId
     * @return void
     */
    public function notifyEmployerOfNewApplication(int $employerId, int $jobId, int $candidateId): void
    {
        $candidate = User::find($candidateId);
        
        Notification::create([
            'user_id' => $employerId,
            'type' => 'new_application',
            'data' => [
                'job_id' => $jobId,
                'candidate_id' => $candidateId,
                'candidate_name' => $candidate ? $candidate->name : 'Candidat',
                'time' => now()->toDateTimeString(),
            ],
            'is_read' => false,
        ]);
    }
    
    /**
     * Notify candidate of application status change
     *
     * @param int $candidateId
     * @param int $jobId
     * @param string $status
     * @return void
     */
    public function notifyCandidateOfApplicationStatusChange(int $candidateId, int $jobId, string $status): void
    {
        Notification::create([
            'user_id' => $candidateId,
            'type' => 'application_status',
            'data' => [
                'job_id' => $jobId,
                'status' => $status,
                'time' => now()->toDateTimeString(),
            ],
            'is_read' => false,
        ]);
    }
    
    /**
     * Notify user of a new message
     *
     * @param int $receiverId
     * @param int $senderId
     * @param int $messageId
     * @return void
     */
    public function notifyUserOfNewMessage(int $receiverId, int $senderId, int $messageId): void
    {
        $sender = User::find($senderId);
        
        Notification::create([
            'user_id' => $receiverId,
            'type' => 'new_message',
            'data' => [
                'sender_id' => $senderId,
                'sender_name' => $sender ? $sender->name : 'Utilisateur',
                'message_id' => $messageId,
                'time' => now()->toDateTimeString(),
            ],
            'is_read' => false,
        ]);
    }
    
    /**
     * Notify users of a new flash job
     *
     * @param int $jobId
     * @param string $category
     * @return void
     */
    public function notifyUsersOfFlashJob(int $jobId, string $category): void
    {
        // Find candidates interested in this category
        $candidates = User::where('role', 'candidate')->get();
        
        foreach ($candidates as $candidate) {
            Notification::create([
                'user_id' => $candidate->id,
                'type' => 'flash_job',
                'data' => [
                    'job_id' => $jobId,
                    'category' => $category,
                    'time' => now()->toDateTimeString(),
                ],
                'is_read' => false,
            ]);
        }
    }
    
    /**
     * Notify candidate of a new contract
     *
     * @param int $candidateId
     * @param int $contractId
     * @param int $jobId
     * @return void
     */
    public function notifyCandidateOfContract(int $candidateId, int $contractId, int $jobId): void
    {
        Notification::create([
            'user_id' => $candidateId,
            'type' => 'new_contract',
            'data' => [
                'contract_id' => $contractId,
                'job_id' => $jobId,
                'time' => now()->toDateTimeString(),
            ],
            'is_read' => false,
        ]);
    }
    
    /**
     * Notify employer of a signed contract
     *
     * @param int $employerId
     * @param int $contractId
     * @param int $jobId
     * @return void
     */
    public function notifyEmployerOfSignedContract(int $employerId, int $contractId, int $jobId): void
    {
        Notification::create([
            'user_id' => $employerId,
            'type' => 'signed_contract',
            'data' => [
                'contract_id' => $contractId,
                'job_id' => $jobId,
                'time' => now()->toDateTimeString(),
            ],
            'is_read' => false,
        ]);
    }
}
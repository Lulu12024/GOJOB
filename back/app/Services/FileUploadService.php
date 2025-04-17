<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload a job photo
     *
     * @param UploadedFile $file
     * @param int $jobId
     * @return string
     */
    public function uploadJobPhoto(UploadedFile $file, int $jobId): string
    {
        $filename = 'job_' . $jobId . '_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('job_photos', $filename, 'public');
        
        return $path;
    }
    
    /**
     * Delete a job photo
     *
     * @param string $photoUrl
     * @return bool
     */
    public function deleteJobPhoto(string $photoUrl): bool
    {
        if (Storage::disk('public')->exists($photoUrl)) {
            return Storage::disk('public')->delete($photoUrl);
        }
        
        return false;
    }
    
    /**
     * Upload an application document (CV, motivation letter)
     *
     * @param UploadedFile $file
     * @param string $type
     * @return string
     */
    public function uploadApplicationDocument(UploadedFile $file, string $type): string
    {
        $filename = $type . '_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('application_documents', $filename, 'public');
        
        return $path;
    }
    
    /**
     * Delete an application document
     *
     * @param string $documentUrl
     * @return bool
     */
    public function deleteApplicationDocument(string $documentUrl): bool
    {
        if (Storage::disk('public')->exists($documentUrl)) {
            return Storage::disk('public')->delete($documentUrl);
        }
        
        return false;
    }
    
    /**
     * Upload a profile image
     *
     * @param UploadedFile $file
     * @param int $userId
     * @return string
     */
    public function uploadProfileImage(UploadedFile $file, int $userId): string
    {
        $filename = 'profile_' . $userId . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('profile_images', $filename, 'public');
        
        return $path;
    }
    
    /**
     * Delete a profile image
     *
     * @param string $imageUrl
     * @return bool
     */
    public function deleteProfileImage(string $imageUrl): bool
    {
        if (Storage::disk('public')->exists($imageUrl)) {
            return Storage::disk('public')->delete($imageUrl);
        }
        
        return false;
    }
    
    /**
     * Upload a contract document
     *
     * @param UploadedFile $file
     * @param string $type
     * @param int $jobId
     * @return string
     */
    public function uploadContractDocument(UploadedFile $file, string $type, int $jobId): string
    {
        $filename = 'contract_' . $type . '_' . $jobId . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('contracts', $filename, 'public');
        
        return $path;
    }
    
    /**
     * Delete a contract document
     *
     * @param string $documentUrl
     * @return bool
     */
    public function deleteContractDocument(string $documentUrl): bool
    {
        if (Storage::disk('public')->exists($documentUrl)) {
            return Storage::disk('public')->delete($documentUrl);
        }
        
        return false;
    }
}
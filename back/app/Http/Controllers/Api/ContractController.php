<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Job;
use App\Services\FileUploadService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContractController extends Controller
{
    protected $fileUploadService;
    protected $notificationService;

    public function __construct(
        FileUploadService $fileUploadService,
        NotificationService $notificationService
    ) {
        $this->fileUploadService = $fileUploadService;
        $this->notificationService = $notificationService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        
        if ($user->role === 'employer') {
            // Employers see contracts they created
            $contracts = Contract::where('employer_id', $user->id)
                              ->with(['candidate', 'job'])
                              ->get();
        } else {
            // Candidates see contracts assigned to them
            $contracts = Contract::where('candidate_id', $user->id)
                              ->with(['employer', 'job'])
                              ->get();
        }
        
        return response()->json([
            'contracts' => $contracts,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_id' => 'required|exists:jobs,id',
            'candidate_id' => 'nullable|exists:users,id',
            'template' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        
        // Check if user is an employer
        if ($user->role !== 'employer') {
            return response()->json([
                'message' => 'Only employers can create contracts',
            ], 403);
        }
        
        // Check if the job belongs to the employer
        $job = Job::findOrFail($request->job_id);
        if ($job->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to create contract for this job',
            ], 403);
        }
        
        try {
            // Upload contract template
            $templateUrl = $this->fileUploadService->uploadContractDocument(
                $request->file('template'),
                'template',
                $job->id
            );
            
            // Create contract
            $contract = Contract::create([
                'job_id' => $job->id,
                'employer_id' => $user->id,
                'candidate_id' => $request->candidate_id,
                'template_url' => $templateUrl,
                'status' => 'draft',
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]);
            
            // If candidate is specified, notify them
            if ($request->candidate_id) {
                $this->notificationService->notifyCandidateOfContract(
                    $request->candidate_id,
                    $contract->id,
                    $job->id
                );
                
                // Update contract status
                $contract->update(['status' => 'sent']);
            }
            
            return response()->json([
                'message' => 'Contract created successfully',
                'contract' => $contract,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create contract',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $user = auth()->user();
        $contract = Contract::with(['employer', 'candidate', 'job'])->findOrFail($id);
        
        // Check authorization
        if ($contract->employer_id !== $user->id && $contract->candidate_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to view this contract',
            ], 403);
        }
        
        return response()->json([
            'contract' => $contract,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'candidate_id' => 'nullable|exists:users,id',
            'template' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'nullable|in:draft,sent,signed,active,terminated',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $contract = Contract::findOrFail($id);
        
        // Check if user is the employer of this contract
        if ($contract->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to update this contract',
            ], 403);
        }
        
        try {
            $data = $request->only(['candidate_id', 'start_date', 'end_date', 'status']);
            
            // Handle template upload if provided
            if ($request->hasFile('template')) {
                $templateUrl = $this->fileUploadService->uploadContractDocument(
                    $request->file('template'),
                    'template',
                    $contract->job_id
                );
                
                // Delete old template if exists
                if ($contract->template_url) {
                    $this->fileUploadService->deleteContractDocument($contract->template_url);
                }
                
                $data['template_url'] = $templateUrl;
            }
            
            // If adding/changing candidate, notify them
            if ($request->has('candidate_id') && $request->candidate_id !== $contract->candidate_id) {
                $this->notificationService->notifyCandidateOfContract(
                    $request->candidate_id,
                    $contract->id,
                    $contract->job_id
                );
                
                // Update status to sent
                $data['status'] = 'sent';
            }
            
            $contract->update($data);
            
            return response()->json([
                'message' => 'Contract updated successfully',
                'contract' => $contract->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update contract',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $contract = Contract::findOrFail($id);
        
        // Check if user is the employer of this contract
        if ($contract->employer_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this contract',
            ], 403);
        }
        
        try {
            // Delete associated files
            if ($contract->template_url) {
                $this->fileUploadService->deleteContractDocument($contract->template_url);
            }
            
            if ($contract->signed_url) {
                $this->fileUploadService->deleteContractDocument($contract->signed_url);
            }
            
            $contract->delete();
            
            return response()->json([
                'message' => 'Contract deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete contract',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function sign(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'signed_contract' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'bank_details' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $contract = Contract::findOrFail($id);
        
        // Check if user is the candidate of this contract
        if ($contract->candidate_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to sign this contract',
            ], 403);
        }
        
        // Check if contract is in a state that can be signed
        if (!in_array($contract->status, ['sent'])) {
            return response()->json([
                'message' => 'This contract cannot be signed in its current state',
            ], 400);
        }
        
        try {
            // Upload signed contract
            $signedUrl = $this->fileUploadService->uploadContractDocument(
                $request->file('signed_contract'),
                'signed',
                $contract->job_id
            );
            
            // Update contract
            $contract->update([
                'signed_url' => $signedUrl,
                'status' => 'signed',
                'signed_at' => now(),
                'bank_details' => $request->bank_details,
            ]);
            
            // Notify employer
            $this->notificationService->notifyEmployerOfSignedContract(
                $contract->employer_id,
                $contract->id,
                $contract->job_id
            );
            
            return response()->json([
                'message' => 'Contract signed successfully',
                'contract' => $contract->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to sign contract',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
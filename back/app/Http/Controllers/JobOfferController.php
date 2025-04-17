<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class JobOfferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jobOffers = JobOffer::all()->map(function ($jobOffer) {
            return [
                'id' => $jobOffer->id,
                'title' => $jobOffer->title,
                'category' => $jobOffer->category,
                'description' => $jobOffer->description,
                'photos' => json_decode($jobOffer->photos),
                'working_rights' => json_decode($jobOffer->working_rights),
                'accommodation_options' => json_decode($jobOffer->accommodation_options),
                'contact_name' => $jobOffer->contact_name,
                'location' => $jobOffer->location,
                'phone_number' => $jobOffer->phone_number,
                'phone_numbers' => $jobOffer->phone_numbers,
                'cdi' => (bool)$jobOffer->cdi,
                'cdd' => (bool)$jobOffer->cdd,
                'alternance' => (bool)$jobOffer->alternance,
                'freelance' => (bool)$jobOffer->freelance,
                'is_hourly' => (bool)$jobOffer->is_hourly,
                'is_monthly' => (bool)$jobOffer->is_monthly,
                'hourly_rate' => $jobOffer->hourly_rate,
                'monthly_rate' => $jobOffer->monthly_rate,
                'gojobs_messaging' => (bool)$jobOffer->gojobs_messaging,
                'call' => (bool)$jobOffer->call,
                'apply' => (bool)$jobOffer->apply,
                'website_redirect' => (bool)$jobOffer->website_redirect,
                'custom_question_1' => $jobOffer->custom_question_1,
                'custom_question_2' => $jobOffer->custom_question_2,
                'contract_images' => json_decode($jobOffer->contract_images),
                'selected_option' => $jobOffer->selected_option,
                'total' => $jobOffer->total,
                'start_date' => $jobOffer->start_date,
                'end_date' => $jobOffer->end_date,
                'auto_renew' => (bool)$jobOffer->auto_renew,
                'promo_code' => $jobOffer->promo_code,
                'created_at' => $jobOffer->created_at,
                'updated_at' => $jobOffer->updated_at,
                'is_active' => (bool)$jobOffer->is_active,
                'user' => $jobOffer->user
            ];
        });

        return response()->json([
            'code' => 200,
            'data' => $jobOffers
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Starting job offer creation', ['request' => $request->all()]);

        $input = $request->all();

        $booleanFields = ['cdi', 'cdd', 'alternance', 'freelance', 'isHourly', 'isMonthly',
            'gojobsMessaging', 'call', 'apply', 'websiteRedirect', 'autoRenew'];
        foreach ($booleanFields as $field) {
            if (isset($input[$field])) {
                $input[$field] = filter_var($input[$field], FILTER_VALIDATE_BOOLEAN);
            }
        }

        if (isset($input['startDate'])) {
            $input['startDate'] = date('Y-m-d', strtotime($input['startDate']));
        }
        if (isset($input['endDate'])) {
            $input['endDate'] = date('Y-m-d', strtotime($input['endDate']));
        }

        if (isset($input['workingRights'])) {
            Log::info('Processing workingRights', ['before' => $input['workingRights']]);
            $input['workingRights'] = is_array($input['workingRights']) ? $input['workingRights'] : [];
            Log::info('Processed workingRights', ['after' => $input['workingRights']]);
        }

        if (isset($input['accommodationOptions'])) {
            Log::info('Processing accommodationOptions', ['before' => $input['accommodationOptions']]);
            $input['accommodationOptions'] = is_array($input['accommodationOptions']) ? $input['accommodationOptions'] : [];
            Log::info('Processed accommodationOptions', ['after' => $input['accommodationOptions']]);
        }

        $request->replace($input);

        $photos = [];
        if ($request->hasFile('selectedPhotos')) {
            Log::info('Processing photos upload');
            foreach ($request->file('selectedPhotos') as $photo) {
                try {
                    if ($photo->isValid()) {
                        $filename = 'photos/' . time() . '_' . Str::random(10) . '.' . $photo->getClientOriginalExtension();
                        $photo->move(public_path('photos'), basename($filename));
                        $photos[] = $filename;
                        Log::info('Photo uploaded successfully', ['filename' => $filename]);
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to upload photo', ['error' => $e->getMessage()]);
                    throw $e;
                }
            }
        }

        $contractImages = [];
        if ($request->hasFile('contractImages')) {
            Log::info('Processing contract images upload');
            foreach ($request->file('contractImages') as $contractImage) {
                try {
                    if ($contractImage->isValid()) {
                        $filename = 'contracts/' . time() . '_' . Str::random(10) . '.' . $contractImage->getClientOriginalExtension();
                        $contractImage->move(public_path('contracts'), basename($filename));
                        $contractImages[] = $filename;
                        Log::info('Contract image uploaded successfully', ['filename' => $filename]);
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to upload contract image', ['error' => $e->getMessage()]);
                    throw $e;
                }
            }
        }

        try {
            $validated = $request->validate([
                'title' => 'required|string',
                'selectedCategory' => 'required|string',
                'description' => 'nullable|string',
                'selectedPhotos' => 'nullable|array',
                'contractImages' => 'nullable|array',
                'workingRights' => 'nullable|array',
                'accommodationOptions' => 'nullable|array',
                'contactName' => 'required|string',
                'location' => 'required|string',
                'phoneNumber' => 'nullable|string',
                'cdi' => 'boolean',
                'cdd' => 'boolean',
                'alternance' => 'boolean',
                'freelance' => 'boolean',
                'isHourly' => 'boolean',
                'isMonthly' => 'boolean',
                'hourlyRate' => 'nullable|numeric',
                'monthlyRate' => 'nullable|numeric',
                'gojobsMessaging' => 'boolean',
                'call' => 'boolean',
                'apply' => 'boolean',
                'websiteRedirect' => 'boolean',
                'phoneNumbers' => 'nullable|string',
                'customQuestion1' => 'nullable|string',
                'customQuestion2' => 'nullable|string',
                'selectedOption' => 'required|string',
                'total' => 'required|numeric',
                'startDate' => 'nullable|date',
                'endDate' => 'nullable|date',
                'autoRenew' => 'boolean',
                'promoCode' => 'nullable|string'
            ]);
            Log::info('Request validation passed', ['validated' => $validated]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed', ['errors' => $e->errors()]);
            throw $e;
        }

        try {
            $jobOffer = JobOffer::create([
                'title' => $validated['title'],
                'category' => $validated['selectedCategory'],
                'description' => $validated['description'],
                'photos' => json_encode($photos, JSON_UNESCAPED_UNICODE),
                'working_rights' => isset($validated['workingRights']) ?
                    json_encode($validated['workingRights'], JSON_UNESCAPED_UNICODE) : '[]',
                'accommodation_options' => isset($validated['accommodationOptions']) ?
                    json_encode($validated['accommodationOptions'], JSON_UNESCAPED_UNICODE) : '[]',
                'contact_name' => $validated['contactName'],
                'location' => $validated['location'],
                'phone_number' => $validated['phoneNumber'],
                'cdi' => $validated['cdi'],
                'cdd' => $validated['cdd'],
                'alternance' => $validated['alternance'],
                'freelance' => $validated['freelance'],
                'is_hourly' => $validated['isHourly'],
                'is_monthly' => $validated['isMonthly'],
                'hourly_rate' => $validated['hourlyRate'],
                'monthly_rate' => $validated['monthlyRate'],
                'gojobs_messaging' => $validated['gojobsMessaging'],
                'call' => $validated['call'],
                'apply' => $validated['apply'],
                'website_redirect' => $validated['websiteRedirect'],
                'phone_numbers' => $validated['phoneNumbers'],
                'custom_question_1' => $validated['customQuestion1'],
                'custom_question_2' => $validated['customQuestion2'],
                'contract_images' => json_encode($contractImages, JSON_UNESCAPED_UNICODE),
                'selected_option' => $this->mapSelectedOption($validated['selectedOption']),
                'total' => $validated['total'],
                'start_date' => $validated['startDate'],
                'end_date' => $validated['endDate'],
                'auto_renew' => $validated['autoRenew'],
                'promo_code' => $validated['promoCode'],
                'is_active' => true,
                'user_id' => Auth::user()->id
            ]);
            Log::info('Job offer created successfully', ['job_offer_id' => $jobOffer->id]);
        } catch (\Exception $e) {
            Log::error('Failed to create job offer', ['error' => $e->getMessage()]);
            throw $e;
        }

        return response()->json(['code' => 200, 'message' => 'Job offer created successfully']);
    }

    private function mapSelectedOption($option)
    {
        $mapping = [
            'top' => 'gold',
            'medium' => 'silver',
            'basic' => 'bronze'
        ];

        return $mapping[$option] ?? null;
    }

    /**
     * Display the specified resource.
     */
    public function show(JobOffer $jobOffer)
    {
        $jobOfferData = [
            'id' => $jobOffer->id,
            'title' => $jobOffer->title,
            'category' => $jobOffer->category,
            'description' => $jobOffer->description,
            'photos' => json_decode($jobOffer->photos),
            'working_rights' => json_decode($jobOffer->working_rights),
            'accommodation_options' => json_decode($jobOffer->accommodation_options),
            'contact_name' => $jobOffer->contact_name,
            'location' => $jobOffer->location,
            'phone_number' => $jobOffer->phone_number,
            'phone_numbers' => $jobOffer->phone_numbers,
            'cdi' => (bool)$jobOffer->cdi,
            'cdd' => (bool)$jobOffer->cdd,
            'alternance' => (bool)$jobOffer->alternance,
            'freelance' => (bool)$jobOffer->freelance,
            'is_hourly' => (bool)$jobOffer->is_hourly,
            'is_monthly' => (bool)$jobOffer->is_monthly,
            'hourly_rate' => $jobOffer->hourly_rate,
            'monthly_rate' => $jobOffer->monthly_rate,
            'gojobs_messaging' => (bool)$jobOffer->gojobs_messaging,
            'call' => (bool)$jobOffer->call,
            'apply' => (bool)$jobOffer->apply,
            'website_redirect' => (bool)$jobOffer->website_redirect,
            'custom_question_1' => $jobOffer->custom_question_1,
            'custom_question_2' => $jobOffer->custom_question_2,
            'contract_images' => json_decode($jobOffer->contract_images),
            'selected_option' => $jobOffer->selected_option,
            'total' => $jobOffer->total,
            'start_date' => $jobOffer->start_date,
            'end_date' => $jobOffer->end_date,
            'auto_renew' => (bool)$jobOffer->auto_renew,
            'promo_code' => $jobOffer->promo_code,
            'created_at' => $jobOffer->created_at,
            'updated_at' => $jobOffer->updated_at,
            'is_active' => (bool)$jobOffer->is_active,
            'user' => $jobOffer->user
        ];

        return response()->json([
            'code' => 200,
            'data' => $jobOfferData
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobOffer $jobOffer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobOffer $jobOffer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobOffer $jobOffer)
    {
        //
    }
}

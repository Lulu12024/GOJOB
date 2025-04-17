<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->string('subcategory')->nullable();
            $table->string('city');
            $table->string('address')->nullable();
            $table->enum('salary_type', ['hourly', 'monthly'])->default('monthly');
            $table->decimal('salary_amount', 10, 2)->nullable();
            $table->enum('contract_type', ['CDI', 'CDD', 'Freelance', 'Alternance'])->default('CDI');
            $table->boolean('is_entry_level')->default(false);
            $table->boolean('accepts_working_visa')->default(false);
            $table->boolean('accepts_holiday_visa')->default(false);
            $table->boolean('accepts_student_visa')->default(false);
            $table->boolean('has_accommodation')->default(false);
            $table->boolean('accommodation_accepts_children')->default(false);
            $table->boolean('accommodation_accepts_dogs')->default(false);
            $table->boolean('accommodation_is_accessible')->default(false);
            $table->boolean('job_accepts_handicapped')->default(false);
            $table->boolean('has_company_car')->default(false);
            $table->integer('experience_years_required')->default(0);
            $table->boolean('requires_driving_license')->default(false);
            $table->string('contact_name')->nullable();
            $table->string('contact_phone')->nullable();
            $table->json('contact_methods')->nullable(); // ['call', 'message', 'apply', 'website']
            $table->string('website_url')->nullable();
            $table->boolean('is_urgent')->default(false);
            $table->boolean('is_new')->default(true);
            $table->boolean('is_top')->default(false);
            $table->enum('status', ['active', 'closed', 'draft'])->default('active');
            $table->timestamp('expires_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('applications_count')->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0.00);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('jobs');
    }
};

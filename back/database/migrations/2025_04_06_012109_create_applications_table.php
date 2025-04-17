<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained()->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained('users')->onDelete('cascade');
            $table->string('cv_url')->nullable();
            $table->string('motivation_letter_url')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'on_hold'])->default('pending');
            $table->boolean('is_read')->default(false);
            $table->json('custom_answers')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications');
    }
};


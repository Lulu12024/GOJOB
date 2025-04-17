<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('apply_ai_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('categories'); // Categories the user is interested in
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->json('excluded_companies')->nullable(); // Companies to exclude from auto-apply
            $table->json('filters')->nullable(); // Additional filters like accommodation, company car, etc.
            $table->time('notification_time'); // Time of day to send recommendations
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('apply_ai_settings');
    }
};
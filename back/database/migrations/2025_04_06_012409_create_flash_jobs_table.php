<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('flash_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained()->onDelete('cascade');
            $table->timestamp('start_time');
            $table->boolean('is_confirmed')->default(false);
            $table->boolean('confirmation_required')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('flash_jobs');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('views')->default(0);
            $table->integer('applications')->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0.00);
            $table->timestamps();
            
            $table->unique(['job_id', 'date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('statistics');
    }
};

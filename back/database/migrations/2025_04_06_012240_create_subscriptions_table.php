<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('plan_type', [
                'basic_pro', 
                'standard_pro', 
                'premium_pro', 
                'apply_ai', 
                'apply_ai_pro'
            ]);
            $table->decimal('amount', 10, 2);
            $table->enum('billing_cycle', ['weekly', 'monthly'])->default('monthly');
            // Modifications ici pour résoudre l'erreur
            $table->timestamp('starts_at')->nullable()->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('auto_renew')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('subscriptions');
    }
};
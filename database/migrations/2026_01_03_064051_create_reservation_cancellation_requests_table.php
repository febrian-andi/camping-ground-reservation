<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservation_cancellation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->text('reason')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])
                ->default('pending');
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->foreignId('decided_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();
            $table->unique('reservation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_cancellation_requests');
    }
};

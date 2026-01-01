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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reservation_number')->unique();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('block_id')->references('id')->on('blocks')->onDelete('cascade');
            $table->date('check_in_date')->index();
            $table->date('check_out_date')->index();
            $table->time('scheduled_check_in_time');
            $table->time('scheduled_check_out_time');
            $table->time('actual_check_in_time')->nullable();
            $table->time('actual_check_out_time')->nullable();
            $table->integer('total_nights')->default(1);
            $table->integer('total_price');
            $table->enum('status', ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'])->default('pending');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};

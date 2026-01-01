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
        Schema::create('block_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('block_id')->references('id')->on('blocks')->onDelete('cascade');
            $table->date('date')->index();
            $table->enum('status', ['booked', 'maintenance'])->default('booked');
            $table->foreignId('reservation_id')->nullable()->references('id')->on('reservations')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('block_availabilities');
    }
};

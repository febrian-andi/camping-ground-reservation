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
        Schema::create('reservation_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->references('id')->on('reservations')->onDelete('cascade');
            $table->string('old_status');
            $table->string('new_status');
            $table->string('note')->nullable();
            $table->foreignId('created_by')->nullable()->references('id')->on('users')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_status_histories');
    }
};

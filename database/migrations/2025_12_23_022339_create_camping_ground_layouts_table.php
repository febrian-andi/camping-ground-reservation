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
        Schema::create('camping_ground_layouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('camping_ground_id')->references('id')->on('camping_grounds')->onDelete('cascade');
            $table->string('layout_image');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('camping_ground_layouts');
    }
};

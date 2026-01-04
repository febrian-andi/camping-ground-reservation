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
        Schema::table('reservations', function (Blueprint $table) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->enum('payment_status', [
                    'pending',
                    'partial_paid',
                    'full_paid',
                    'failed',
                    'refunded',
                ])
                    ->default('pending')
                    ->after('status');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('payment_status');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_provider')
                ->nullable()
                ->after('method');
        });

        DB::statement("
            UPDATE payments
            SET method = 'cash'
            WHERE method = 'on_arrival'
        ");

        DB::statement("
            ALTER TABLE payments
            MODIFY method ENUM('cash', 'transfer', 'qris') NOT NULL
        ");

        DB::statement("
            ALTER TABLE payments
            MODIFY status ENUM('pending', 'verified', 'failed', 'refunded')
            NOT NULL DEFAULT 'pending'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE payments
            MODIFY status ENUM('pending', 'verified', 'failed')
            NOT NULL DEFAULT 'pending'
        ");

        DB::statement("
            ALTER TABLE payments
            MODIFY method ENUM('on_arrival', 'transfer') NOT NULL
        ");

        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('payment_provider');
        });
    }
};

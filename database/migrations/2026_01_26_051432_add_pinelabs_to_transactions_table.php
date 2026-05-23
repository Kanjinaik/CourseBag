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
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('razorpay_order_id')->nullable()->change();
            $table->string('pinelabs_order_id')->nullable()->after('razorpay_signature');
            $table->string('pinelabs_payment_id')->nullable()->after('pinelabs_order_id');
            $table->string('payment_gateway')->default('razorpay')->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // $table->string('razorpay_order_id')->nullable(false)->change(); // Risk of failure
            $table->dropColumn(['pinelabs_order_id', 'pinelabs_payment_id', 'payment_gateway']);
        });
    }
};

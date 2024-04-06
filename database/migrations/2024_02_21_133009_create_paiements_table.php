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
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp("deleted_at")->nullable();
            $table->string("special_id")->nullable();
            $table->longText("Facture")->nullable();
            $table->unsignedBigInteger("facture_id")->nullable();
            $table->float("usd")->default(0);
            $table->float("cdf")->default(0);
            $table->float("taux");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};

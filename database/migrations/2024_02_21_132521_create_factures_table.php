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
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp("deleted_at")->nullable();
            $table->string("special_id");
            $table->unsignedBigInteger("client_id")->nullable();
            $table->longText("Client");
            $table->longText("Reduction")->nullable();
            $table->longText("User")->nullable();
            $table->string("numfacture");
            $table->boolean("is_paid")->default(false);
            $table->unsignedBigInteger("user_id")->nullable();
            $table->unsignedBigInteger("reduction_id")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};

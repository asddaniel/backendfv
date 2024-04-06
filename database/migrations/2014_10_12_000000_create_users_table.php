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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string("username")->nullable();
            $table->unsignedBigInteger("role")->default(0);
            $table->string('email')->nullable();
            $table->string("telephone")->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp("deleted_at")->nullable();
            $table->string("special_id");
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

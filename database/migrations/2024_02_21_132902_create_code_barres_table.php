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
        Schema::create('code_barres', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp("deleted_at")->nullable();
            $table->string("special_id");
            $table->string("codebarre");
            $table->longText("Produit")->nullable();
            $table->longText("Approvisionnement")->nullable();	
            $table->unsignedBigInteger("produit_id")->nullable();
            $table->unsignedBigInteger("approvisionnemen_id")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('code_barres');
    }
};

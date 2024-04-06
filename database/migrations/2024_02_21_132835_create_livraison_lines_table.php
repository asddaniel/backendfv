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
        Schema::create('livraison_lines', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp("deleted_at")->nullable();
            $table->string("special_id");
            $table->longText("Livraison")->nullable();
            $table->longText("Produit")->nullable();
            $table->longText("CodeBarre")->nullable();
            $table->unsignedBigInteger("livraison_id")->nullable();
            $table->unsignedBigInteger("produit_id")->nullable();
            $table->bigInteger("quantite")->default(1);
            $table->unsignedBigInteger("code_barre_id")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livraison_lines');
    }
};

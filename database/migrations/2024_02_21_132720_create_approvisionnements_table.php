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
        Schema::create('approvisionnements', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp("deleted_at")->nullable();
            $table->string("special_id");
            $table->bigInteger("quantite");
            $table->longText("Produit")->nullable();
            $table->longText("Fournisseur")->nullable();
            $table->double("prix")->nullable();
            $table->unsignedBigInteger("produit_id")->nullable();
            $table->unsignedBigInteger("fournisseur_id")->nullable();
            $table->text("description")->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvisionnements');
    }
};

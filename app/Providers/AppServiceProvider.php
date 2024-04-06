<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Route;
use App\Models\Approvisionnement;
use App\Models\Categorie;
use App\Models\Produit;
use App\Models\Client;
use App\Models\CodeBarre;
use App\Models\Facture;
use App\Models\Livraison;
use App\Models\Fournisseur;
use App\Models\LigneFacture;
use App\Models\Paiement;
use App\Models\LivraisonLine;
use App\Models\Reduction;
use App\Models\RoleUser;
use App\Models\User;
use App\Models\Role;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(200);
        Route::bind("Approvisionnement", function($produit){
            return Approvisionnement::where("special_id", $produit)->first();
        });
        Route::bind("Categorie", function($categorie){
            return Categorie::where("special_id", $categorie)->first();
        });
        Route::bind("Client", function($client){
            return Client::where("special_id", $client)->first();
        });
        Route::bind("CodeBarre", function($codebarre){
            return CodeBarre::where("special_id", $codebarre)->first();
        });
        Route::bind("Facture", function($facture){
            return Facture::where("special_id", $facture)->first();
        });
        Route::bind("Fournisseur", function($fournisseur){
            return Fournisseur::where("special_id", $fournisseur)->first();
        });
        Route::bind("LigneFacture", function($specialid){
            return LigneFacture::where("special_id", $specialid)->first();
        });
        Route::bind("Livraison", function($livraison){
            return Livraison::where("special_id", $livraison)->first();
        });
        Route::bind("LivraisonLine", function($line){
            return LivraisonLine::where("special_id", $line)->first();
        });
        Route::bind("Paiement", function($paiement){
            return Paiement::where("special_id", $paiement)->first();
        });
        Route::bind("Reduction", function($reduction){
            return Reduction::where("special_id", $reduction)->first();
        });
        Route::bind("RoleUser", function($roleuser){
            return RoleUser::where("special_id", $roleuser)->first();
        });
        Route::bind("User", function($user){
            return User::where("special_id", $user)->first();
        });
        Route::bind("Role", function($role){
            return Role::where("special_id", $role)->first();
        });
       
        Route::bind("Produit", function($produit){
            return Produit::where("special_id", $produit)->first();
        });
        //
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Approvisionnement extends Model
{
    use HasFactory;
      /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fournisseur_id',
        'produit_id',
        "Fournisseur",
        'Produit',
        'quantite',
        'prix',
        'description',
        'is_deleted',
        'created_at',
        'updated_at',
        'deleted_at',
        'special_id',
    ];

    /**
     * Get the produit for the approvisionnement.
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    /**
     * Get the fournisseur for the approvisionnement.
     */
    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }
}

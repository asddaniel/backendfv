<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LigneFacture extends Model
{
    use HasFactory;
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'facture_id',
        'produit_id',
        'Facture',
        "Produit",
        'quantite',
        'is_deleted',
        'created_at',
        'updated_at',
        'deleted_at',
        'special_id',
    ];

    /**
     * Get the facture for the ligne facture.
     */
    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }

    /**
     * Get the produit for the ligne facture.
     */
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}

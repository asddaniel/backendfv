<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LivraisonLine extends Model
{
    use HasFactory;
    protected $fillable = [
        'livraison_id',
        'special_id',
        'Livraison',
        'Produit',
        'CodeBarre',
        'produit_id',
        'quantite',
        'code_barre_id', 
        'created_at',
        'updated_at',
        'deleted_at',
        'is_deleted',
    ];
}

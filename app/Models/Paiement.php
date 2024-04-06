<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;
    protected $fillable = [
        "facture_id", 
        "Facture",
        "usd", 
        "cdf", 
        "taux", 
        "created_at", 
        "updated_at",
        "deleted_at", 
        "special_id", 
        "is_deletd",
    ];
}

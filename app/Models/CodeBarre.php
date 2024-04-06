<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeBarre extends Model
{
    use HasFactory;
    protected $fillable = [
         "codebarre", 
         "Produit", 
         "Approvisionnement",
         "Fournisseur",
         "produit_id", 
         "is_deleted",
        "created_at",
        "updated_at",
        "deleted_at",
        "special_id"
    ];
}

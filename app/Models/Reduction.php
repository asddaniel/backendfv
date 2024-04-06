<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reduction extends Model
{
    use HasFactory;
    protected $fillable = [
        "montant",
        "pourcentage",
        'Facture',
        'pourcentage',
        'facture_id',
        "is_deleted",
        "created_at",
        "updated_at",
        "deleted_at",
        "special_id"
        ];
        
        public function facture(): \Illuminate\Database\Eloquent\Relations\BelongsTo
        {
        return $this->belongsTo(Facture::class);
        }
}

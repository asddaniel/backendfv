<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facture extends Model
{
    use HasFactory;
    protected $fillable = [
        "client_id",
        "numfacture",
        'Client',
        "is_paid",
        "user_id",
        "reduction_id",
        "Reduction",
        "User",
        "is_deleted",
        "created_at",
        "updated_at",
        "deleted_at",
        "special_id"
        ];
        
        public function client(): \Illuminate\Database\Eloquent\Relations\BelongsTo
        {
        return $this->belongsTo(Client::class);
        }
        
        public function payment(): \Illuminate\Database\Eloquent\Relations\HasOne
        {
        return $this->hasOne(Paiement::class);
        }
        
        public function product(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
        {
        return $this->belongsToMany(Produit::class)->withPivot(["quantity"]);
        }
        
        public function reduction(): \Illuminate\Database\Eloquent\Relations\BelongsTo
        {
        return $this->belongsTo(Reduction::class);
        }
        
        public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
        {
        return $this->belongsTo(User::class);
        }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livraison extends Model
{
    use HasFactory;

    protected $fillable = [
       'facture_id',
       'Facture',
       'created_at',
       'updated_at',
       'special_id',
       'is_deleted',
       'deleted_at',
       'User',
       'user_id'
    ];
}

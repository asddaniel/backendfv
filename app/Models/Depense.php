<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depense extends Model
{
    use HasFactory;
    protected $fillable  = [
        "special_id", 
        "libelle",
        "description",
        'is_deleted',
        'created_at',
        'updated_at',
        'deleted_at',
        'montant'
    ];
}

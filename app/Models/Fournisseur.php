<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'telephone',
        'email',
        'is_deleted',
        'created_at',
        'updated_at',
        'deleted_at',
        'special_id',
    ];

    /**
     * Get the approvisionnements for the fournisseur.
     */
    public function approvisionnements()
    {
        return $this->hasMany(Approvisionnement::class);
    }
}

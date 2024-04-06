<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'is_deleted',
        'created_at',
        'updated_at',
        'deleted_at',
        'special_id'
    ];
}

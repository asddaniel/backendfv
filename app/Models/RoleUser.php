<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleUser extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'User',
        'Role',
        'role_id',
        "created_at", 
        "updated_at", 
        "deleted_at",
        "special_id", 
        "is_deleted"
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "tel",
        "email",
        "is_deleted",
        "created_at",
        "updated_at",
        "deleted_at",
        "special_id"
        ];
}

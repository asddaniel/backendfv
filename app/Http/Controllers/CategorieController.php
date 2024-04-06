<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Http\Requests\StoreCategorieRequest;
use App\Http\Requests\UpdateCategorieRequest;

class CategorieController extends StandardController
{
    protected string $model = "App\http\models\Categorie";

    protected $validator = [
        "App\http\Requests\StoreCategorieRequest",
        "App\http\Requests\UpdateCategorieRequest"
    ];
    /**
     * Display a listing of the resource.
     */


    /**
     * Show the form for editing the specified resource.
     */
    

    
}

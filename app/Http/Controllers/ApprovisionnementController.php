<?php

namespace App\Http\Controllers;

use App\Models\Approvisionnement;
use App\Http\Requests\StoreApprovisionnementRequest;
use App\Http\Requests\UpdateApprovisionnementRequest;

class ApprovisionnementController extends StandardController
{

    protected string $model = "App\Models\Approvisionnement";
    protected $validator = [
        "App\http\Request\StoreApprovisionnementRequest", 
        "App\http\Request\UpdateApprovisionnementRequest"
    ];
    /**
     * Display a listing of the resource.
     */
  

   

    /**
     * Store a newly created resource in storage.
   

    /**
     * Display the specified resource.
     */
    public function show(Approvisionnement $approvisionnement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    /**
     * Update the specified resource in storage.
     */
    
}

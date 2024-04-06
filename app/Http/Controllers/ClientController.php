<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;

class ClientController extends StandardController
{
    protected string $model = "App\Models\Client";
    protected $validator = [
            "App\Http\Requests\StoreClientRequest",
            "App\Http\Requests\UpdateClientRequest"
    ];
    
    public function testimony(){
        return $this->getModel();
    }

}

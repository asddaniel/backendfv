<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\StandardResource;
use illuminate\Support\Facades\Route;

class StandardController extends Controller
{
    protected string $model = "";
    protected $validators = [];
    protected $invokable = [];


    protected function getModelName (){
        $decoupe = explode("\\", get_called_class());
        $model = str_replace("Controller", "", $decoupe[count($decoupe)-1]);
        $name = ucfirst(strtolower($model));
        return $name;
    }

    protected function getModel(){
       $name  = $this->getModelName();

        return "App\Models\\{$name}";

    }
    protected function getValidatorStoreClass(){
            return "App\Http\Request\Store{$this->getModelName()}Request";
    }

    protected function getValidatorUpdateClass(){
        return "App\Http\Request\Update{$this->getModelName()}Request";
}

    protected function match(string $expression){
        foreach ($this->validators as $key => $value) {
           if(preg_match("/".$expression."/", $value)){
               return $value;
           }
        }
        return false;
    }
    //
    public function index (){
        return new StandardResource($this->getModel()::all());
    }
    public function store(Request $request)
    {
        $validator_cls_name = $this->match("Store");
        if($validator_cls_name){
            $validator_cls_name = $this->match("Store");
        $validator = new $validator_cls_name();
            return $this->model::create($request->validate($validator->rules()));
        }

    }

    public static function route(){
        $decoupe = explode("\\", get_called_class());
        $model = str_replace("Controller", "", $decoupe[count($decoupe)-1]);
        $name = strtolower($model);
       // return $name;
        Route::get("/".$name, [get_called_class(), "index"]);
        Route::post("/".$name, [get_called_class(), "store"]);
        Route::get("/".$name."/{".$model."}", [get_called_class(), "show"]);
        Route::put("/".$name."/{".$model."}", [get_called_class(), "update"]);
        Route::delete("/".$name."/{".$model."}", [get_called_class(), "destroy"]);
        $that = new (get_called_class())();
        foreach ($that->invokable as $key => $value) {
            if(is_array($value)){
                switch ($value["method"]) {
                    case 'post':
                        Route::post("/".$key, [get_called_class(), $value["call"]]);
                        break;
                    case 'get':
                        Route::get("/".$key, [get_called_class(), $value["call"]]);
                        break;
                    case 'patch':
                        Route::patch("/".$key, [get_called_class(), $value["call"]]);
                        break;
                    case 'delete':
                        Route::delete("/".$key, [get_called_class(), $value["call"]]);
                        break;

                    default:
                        # code...
                        break;
                }

            }else{
                // dd($key);
                Route::get("/".$key, [get_called_class(), $value]);
            }
        }

     }

    public function update(Request $request, mixed $object){

        $validator_cls_name = $this->getValidatorStoreClass();
        if($validator_cls_name){
            $validator = new $validator_cls_name();
            return new StandardResource($object->update($request->validate($validator->rules())));
        }
    }

    public function destroy(mixed $object){
        return new StandardResource($object->delete());
    }

}

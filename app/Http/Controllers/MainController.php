<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\DB;
use App\Http\Requests\DataSyncRequest;
use App\Http\Requests\RegisterModelRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\PostRequest;
use App\Http\Requests\UpdateRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MainController extends Controller
{
    //
 

public function getDatasync( DataSyncRequest $request){


$donnees = $request->validated();
$received = $donnees['data'];
$last = $donnees['last_modified'];
Log::alert($last);
// return $received;
$this->runUpdates($received, $last);

$ignoredTables = ['migrations', 'personal_access_tokens', 'password_reset_tokens', 'failed_jobs']; // Liste des tables à ignorer

$tables = DB::select('SHOW TABLES');
        $data = [];

        foreach ($tables as $table) {
            $tableName = reset($table);
            if (!in_array($tableName, $ignoredTables)) {
            $data[$tableName] = DB::table($tableName)->where("created_at", ">", $last)->orWhere("updated_at", ">", $last)->get();
            foreach ($data[$tableName] as $tablecontent) {
                  
            }
            }
        }

        return response()->json($data);


}
// public function testPublic (){
//   $data = $this->runUpdates(json_decode(Storage::get('public/content.json')));
//   return response()->json($data);
// }
public function runUpdates($dataList,  $updated_at)
{
  $toUpdate = [];
  $toInsert = [];
  // Log::alert($dataList);
  // Log::alert(strtotime("2024-03-01T22:00:00.000Z")< strtotime("2024-02-29 07:11:48"));
  $updating_params = Storage::get("storage.json");
  $last_modified = "";
  if($updating_params){
    $last_modified = json_decode($updating_params)->created_at;
  }else{

   
    $last_modified =  date("Y-m-d H:i:s");
    Storage::put( "storage.json", json_encode(["created_at"=>$last_modified]) );
  }
  // log::alert($last_modified);
    foreach ($dataList as $table => $data) {
      $tbname = $table;
     
      if (substr($tbname, -1) == 's') {
        // Suppression du s
        $tbname = substr($tbname, 0, -1);
    }
    $modelBruteName = strtoupper(substr($tbname, 0, 1)).substr($tbname, 1, strlen($tbname)); 
    $tbname = "App\Models\\".strtoupper(substr($tbname, 0, 1)).substr($tbname, 1, strlen($tbname)); 
    
        $localData = (strtoupper(substr($tbname, 0, 1)).substr($tbname, 1, strlen($tbname)))::where("created_at", ">", $updated_at)->orWhere("updated_at", ">", $updated_at)->get()->toArray(); 
        //Log::alert($localData);
        $localData = array_filter($localData, function($item) use ($updated_at) {
          Log::alert(strtotime($item["created_at"]));
          return strtotime($item["created_at"]) > strtotime($updated_at) || strtotime($item["updated_at"]) > strtotime($updated_at);
        });
       
   
       
          
        // Filtrer les éléments identiques
        $identiques = array_filter($data, function ($item) use ($localData) {
            return array_filter($localData, function($el) use ($item){
                        return $el['special_id']==$item['special_id'];
            });
            //return $localData->where('special_id', $item->special_id)->first();
        });
        //dd($identiques);

        foreach ($identiques as $identique) {
          $localItem = array_filter($localData, function($el) use ($identique){
                        return $el['special_id']==$identique['special_id'];
            });
            if(count($localItem) > 0 && array_key_exists('0', $localItem)){
             // dd($localItem);
              $localItem = $localItem[0];
            }else{ 
              continue;
            }
            

            if(array_key_exists('updated_at', $identique)){
              $identique["updated_at"] = trim(explode(".", $identique["updated_at"])[0]);
              if ((intval(strtotime($identique["updated_at"]??'2000-02-02'))?? intval(strtotime('2000-02-02'))) >  intval(strtotime($localItem["updated_at"]))) {
                // Mettre à jour l'élément local
              Log::alert($identique["updated_at"]."-----");
          
              Log::alert(intval(strtotime($localItem["updated_at"]))<intval(strtotime($identique["updated_at"]))?1:2);
                $toUpdate = null; //$identique;
                if (isset($toUpdate['updatedAt'])) $toUpdate['updated_at'] = $toUpdate['updatedAt'] ?? null; unset($toUpdate['updatedAt']);
                 foreach ($identique as $key => $value) {
                  if($key=="udpdatedAt") continue;
                  if($key=="updatedAt"){
                    $toUpdate['updated_at'] = $toUpdate['updatedAt'] ?? null;
                  }else{
                    $toUpdate[$key] = $value;
                  }
                  if($key == "updated_at" || $key=="created_at"){
                    if($toUpdate[$key]!==null)
                    $toUpdate[$key] = trim(explode(".", $toUpdate[$key])[0]);
                  }
                 }
                 $validatorclass = "App\Http\Requests\Update".$modelBruteName."Request";
                 //App\Http\Requests\UpdateCategorieRequest  
                 Log::alert($validatorclass);
                 $validatorclass = new $validatorclass();
                 Log::alert($validatorclass);
                 $validate = Validator::make($toUpdate, $validatorclass->rules());
                 //$validatorclass->validated();
                // $toUpdate = $validate->all();
                 //$toUpdate = $validatorclass->safeForUpdate()->all();
               $tbname::where('special_id', $identique['special_id'])->update(array_intersect_key($toUpdate, $validatorclass->rules()));
                array_push($toUpdate, $identique);
            }

            }
            
        }

        // Filtrer les éléments non identiques
        $key_special_ids = array_map(function($item) { return $item['special_id']; }, $identiques);
        $nonIdentiques = array_filter($data, function($el) use ($key_special_ids){

                        return !in_array($el['special_id'], $key_special_ids);
                       
            });
            // if(count($identiques)==0){
            //   $nonIdentiques = $data;
            // }

        // Insérer les éléments non identiques
       $model = (strtoupper(substr($tbname, 0, 1)).substr($tbname, 1, strlen($tbname)));
       foreach ($nonIdentiques as $key => $value) {
        # code...
        foreach ($nonIdentiques[$key] as $mcle => $mvaleur) {
          # code...
          if(is_array($mvaleur)){
            $nonIdentiques[$key][$mcle] = json_encode($mvaleur);
          }
          //$nonIdentiques[$key][$mcle] = json_encode($mvaleur);
        }
        $nonIdentiques[$key]= $model::create($nonIdentiques[$key]);
       }
        array_push($toInsert, $nonIdentiques);
    }

    return ['toUpdate' => $toUpdate, 'toInsert' => $toInsert];
}

public function getDb(){
$ignoredTables = ['migrations', 'personal_access_tokens', 'password_reset_tokens', 'failed_jobs']; // Liste des tables à ignorer

$tables = DB::select('SHOW TABLES');
        $data = [];

        foreach ($tables as $table) {
            $tableName = reset($table);
            if (!in_array($tableName, $ignoredTables)) {
            $data[$tableName] = DB::table($tableName)->get();
            foreach ($data[$tableName] as $tablecontent) {
                  
            }
            }
        }

        return response()->json($data);
}
public function register_in_database(RegisterModelRequest $request){
    $data = $request->validated();
    $model = $data['table_name'];
    $data = $data['data'];
    $this->register_in_database($model, $data);
}

public function post(PostRequest $request){
  $data = $request->validated();
  $toInsert = get_object_vars(json_decode($data['data']));
  $tbname = "App\Models\\".strtoupper(substr($data['table'], 0, 1)).substr($data['table'], 1, strlen($data['table']));
   $created =  $tbname::create($toInsert);
  //"App\Models\\".$data['table'];
  return response()->json($created);

}
public function update(UpdateRequest $request){
  $data = $request->validated();
  $toInsert = get_object_vars(json_decode($data['data']));
  $tbname = "App\Models\\".strtoupper(substr($data['table'], 0, 1)).substr($data['table'], 1, strlen($data['table']));
  $updated = $tbname::where('special_id', $data['special_id'])->update($toInsert);
  return response()->json($updated);
}

private function updateModel($model, $data){
  $localData = $model::all()->toArray(); 
          //dd($localData);
          
        // Filtrer les éléments identiques
        $identiques = array_filter($data, function ($item) use ($localData) {
            return array_filter($localData, function($el) use ($item){
                        return $el['special_id']==$item['special_id'];
            });
       
        });
       
        foreach ($identiques as $identique) {
          $localItem = array_filter($localData, function($el) use ($identique){
                        return $el['special_id']==$identique['special_id'];
            });
            if(count($localItem) > 0 && array_key_exists('0', $localItem)){
             // dd($localItem);
              $localItem = $localItem[0];
            }else{ 
              continue;
            }
            //dd($localItem);
            //$localItem = $localData->where('special_id', $identique->special_id)->first();

            if(array_key_exists('updated_at', $identique)){
              if ((strtotime($identique->updated_at??'2000-02-02'))?? strtotime('2000-02-02') >  strtotime($localItem["updated_at"])) {
               
                $toUpdate = get_object_vars($identique);
                $model::where('special_id', $identique->special_id)->update($toUpdate);
               // array_push($toUpdate, $identique);
            }

            }
            
        }

        // Filtrer les éléments non identiques
        //dd($data);
        $key_special_ids = array_map(function($item) { return $item['special_id']; }, $identiques);
        $nonIdentiques = array_filter($data, function($el) use ($key_special_ids){

                        return !in_array($el['special_id'], $key_special_ids);
                       
            });
            // if(count($identiques)==0){
            //   $nonIdentiques = $data;
            // }

        // Insérer les éléments non identiques
        foreach ($nonIdentiques as $key => $value) {
        # code...
        $nonIdentiques[$key]= $model::create($nonIdentiques[$key]);
       }
}
}

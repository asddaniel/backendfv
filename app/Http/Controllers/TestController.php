<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Session;

class TestController extends Controller
{
    public function lireModeles() {
        $modeles = array_values(array_filter(get_declared_classes(), function ($class) {
            return is_subclass_of($class, 'Illuminate\Database\Eloquent\Model');
        }));
        echo "ok";

        foreach ($modeles as $modele) {
            $table = $modele::getTable();
            $colonnes = Schema::getColumnListing($table);

            foreach ($colonnes as $colonne) {
                $type = Schema::getColumnType($table, $colonne);

                echo "{$table}: {$colonne} ({$type})\n";
            }
        }
    }

    public function lireMigrations() {
        if(Session::has("database")){
            return response()->json(Session::get("database"));
        }
        $migrations = File::allFiles(database_path('migrations'));
        $all = [];

        foreach ($migrations as $migration) {
            $contenu = file_get_contents($migration);
           // echo $migration;
          
            $table = explode("_create_",explode(".php", $migration)[0])[1];
            $table = explode("_table", $table)[0];
//dd($table);
            $st_table = ["name"=>$table];
            preg_match_all('/\$table->(.*?);/', $contenu, $matches);
            $types = [];
            if (isset($matches[1])) {
               // $table = $matches[1][0];
                //dd($matches);
                $colonnes = Schema::getColumnListing($table);

                foreach ($colonnes as $colonne) {
                    $type = Schema::getColumnType($table, $colonne);
                    array_push($types, [$colonne=>$type]);

                    //echo "{$table}: {$colonne} ({$type})\n";
                }
                // $st_table["types"] = $types;
                $all[$table] = $types;
                // array_push($all, $st_table);
            }
        }
        Session::put("database", $all);
        return response()->json($all);
        //dd($all);
    }
}

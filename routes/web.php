<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
$fichiers = [];
try {
    //code...
    $fichiers = scandir("../app/Http/Controllers");
} catch (\Throwable $th) {
    //throw $th;
}

$all = [];
foreach ($fichiers as $fichier) {
    // Ignorer les entrées "." et ".."
    if ($fichier != "." && $fichier != ".." && $fichier != "StandardController.php" && $fichier != "Controller.php" && $fichier != "TestController.php" && $fichier != "MainController.php") {
        // Afficher le nom du fichier
        // echo $fichier . "<br>";
        // array_push($all, pathinfo($fichier, PATHINFO_FILENAME));
         $controller = pathinfo($fichier, PATHINFO_FILENAME);
        "App\Http\Controllers\\{$controller}"::Route();
        
        // Vous pouvez également lire le contenu du fichier ici
        // Exemple :
        // $contenu = file_get_contents($chemin_dossier . "/" . $fichier);
        // echo $contenu;
    }
}
// dd($all);
// Route::get('/',[TestController::class,'lireMigrations']);
Route::get("/", function(){
    return view("welcome");
});


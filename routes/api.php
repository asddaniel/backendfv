<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
// use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post("/style", function(Request $request){
    return Storage::put("style.css", $request->input('style'));   
});
Route::post("/stylejson", function(Request $request){
    return Storage::put("style.json", $request->input('style'));   
});

Route::get("/essais", function(Request $request){
    return response()->json([1, 3, 6]);
});
Route::post('/post', [App\Http\Controllers\MainController::class, 'post']);
Route::post('/syncronize',[App\Http\Controllers\MainController::class, 'getDatasync']);
Route::post('/syncdata', [App\Http\Controllers\MainController::class, 'getDatasync']);
// Route::get('/test', [App\Http\Controllers\MainController::class, 'send']);
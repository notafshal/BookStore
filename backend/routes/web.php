<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class, 'login']);

<?php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;

//User
Route::get('/', [BookController::class, 'index']);
Route::get('/return', [BookController::class, 'returnBook']);
//Route::post('/borrow', [BookController::class, 'storeNewBook']);
//Route::post('/return', [BookController::class, 'storeNewBook']);

//Admin
Route::get('/admin', [BookController::class, 'admin']);

//Route::post('/admin', [BookController::class, 'returnBook']);
//Route::post('/admin', [BookController::class, 'storeNewBook']);


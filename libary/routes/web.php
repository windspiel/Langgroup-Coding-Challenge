<?php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;

//User
Route::get('/', [BookController::class, 'homeView']);
Route::get('/return', [BookController::class, 'returnBookView']);
Route::post('/borrowBook', [BookController::class, 'borrowBook']);
//Route::post('/return', [BookController::class, 'storeNewBook']);

//Admin
Route::get('/admin', [BookController::class, 'adminView']);

//Route::post('/admin', [BookController::class, 'returnBook']);
Route::post('/storeNewBook', [BookController::class, 'storeNewBook']);


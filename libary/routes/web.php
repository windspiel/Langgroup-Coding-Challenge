<?php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BookController::class, 'index']);

Route::get('/admin', function () {
    return view('admin');
});
Route::get('/return', function () {
    return view('return');
});


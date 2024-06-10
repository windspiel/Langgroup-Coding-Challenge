<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});
Route::get('/admin', function () {
    return view('admin');
});
Route::get('/return', function () {
    return view('return');
});


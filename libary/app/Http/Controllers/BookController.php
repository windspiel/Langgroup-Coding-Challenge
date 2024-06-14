<?php

namespace App\Http\Controllers;

use App\Models\Lib_user;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Models\Book;

class BookController extends Controller
{
    public function homeView()
    {
        $books = Book::all();
        return view('home', compact('books') );
        
        //return view('home');
    }
    public function adminView()
    {
        $books = Book::all();
        return view('admin', compact('books') );
        //OrderdBy title
    }
    public function returnBookView()
    {
        $books = Book::where('isBorrowed',1)->get();
        return view('return', compact('books'));
        //borrowedBy == UserID
    }

    


    public function storeNewBook(){
        $book = new Book;
        $book->name = request('name');
        $book->autor = request('autor');
        $book->releaseDate = request('releaseDate');
        $book->borrowedBy = request('borrowedBy');
        $book->borrowedAt = request('borrowedAt');
        $book->borrowedAt = request('returnedAt');
        $book->isBorrowed = request('isBorrowed');
        $book->save();
    }

}

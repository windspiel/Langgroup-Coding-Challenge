<?php

namespace App\Http\Controllers;

use App\Models\Lib_user;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Models\Book;
use Carbon\Carbon;

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
        //dd($_REQUEST);
        $book = new Book;
        $book->name = request('name');
        $book->autor = request('autor');
        $book->releaseDate = request('releaseDate');
        $book->borrowedFrom = 5;
        $book->isBorrowed = 0;
        $book->borrowedAt = Carbon::parse("2024-01-01")->format("Y-m-d");
        $book->returnedAt = Carbon::parse("2024-01-01")->format("Y-m-d");
        $book->save();

    }
    public function borrowBook(){
        //dd($_REQUEST);

        $bookId = request('bookId');
        $userId = request('userId');

        $books = Book::where('id',$bookId)->get();
        $book= Book::find($bookId);

        $book->borrowedFrom = $userId;
        $book->borrowedAt = Carbon::now()->format("Y-m-d");

        $book->update();
    }

}

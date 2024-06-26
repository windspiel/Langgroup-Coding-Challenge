<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>return</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

        <!-- Styles -->
        <link href="css/libaryStyle.css" rel="stylesheet" />
         <!--Script-->
         <script src="js/libary.js"></script> 
    </head>
<body>
    <div id="header">
        
        
        <ul>
            <li id="logo" onclick="navHome()">
                <h1 >LIBARY</h1>
            </li>
            <li>
                <a class="nav-link notSelected" href="/">BORROW</a>
            </li>
            <li>
                <a class="nav-link selected" href="/return">RETURN</a>
            </li>
            <li>
                <a class="nav-link notSelected" href="/admin">ADMIN</a>
            </li>
            <li>
                <img src="icon.jpg" alt="Login" id="userIcon">
            </li>
        </ul>
        
    </div>
    <div class="container text-center">
        <div class="row">
            @foreach ($books as $book)
            <div class="col">
                <div class="bookItem">
                    <div class="titleSpace">
                        <h2 class="bookTitle">{{$book->name}}</h2>
                    </div>
                    <div class="infoSpace">
                        <a class="autor"> {{$book->autor}} {{$book->releaseDate}}</a>
                        <div class="borrowedAt info" >
                            <img class = "borrowedAtImg" alt=">>"> 
                            <a>{{$book->borrowedAt}} </a>  
                        </div>
                    </div>
                    <div class="buttonSpace">
                        <button onclick="returnBook({{$book->id}})"> Return Book </button>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</body>
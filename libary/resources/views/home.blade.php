<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>borrow</title>

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
                <a class="nav-link selected" href="/">BORROW</a>
            </li>
            <li>
                <a class="nav-link notSelected" href="/return">RETURN</a>
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
                <form action="/borrowBook" method="POST">
                    {{ csrf_field() }}
                <div class="bookItem">
                    <div class="titleSpace">
                        <h2 class="bookTitle">{{$book->name}}</h2>
                    </div>
                    <div class="infoSpace">
                        <a class="autor"> {{$book->autor}} {{$book->releaseDate}}</a>
                        @if($book->isBorrowed)
                        <div class= "availableItem info">
                            <img class = "notAvailableImg"> 
                            <a> not available </a>  
                        </div>
                            
                        @else
                        <div class= "availableItem info"> 
                            <img class = "availableImg"> 
                            <a> available </a>  
                        </div>
                        @endIf
                    </div>

                    <div class="buttonSpace">
                        <input name="userId" value="5"></input>
                        <input name="bookId" value={{$book->id}}></input>
                        <button type="submit" > Borrow </button>
                    </div>
                </div>
                </form>
            </div>
            @endforeach
        </div>
    </div>
</body>
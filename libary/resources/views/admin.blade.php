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
    </head>
<body>
    <div id="header">
        
        
        <ul>
            <li id="logo">
                <h1 >LIBARY</h1>
            </li>
            <li>
                <a class="nav-link notSelected" href="/">BORROW</a>
            </li>
            <li>
                <a class="nav-link notSelected" href="/return">RETURN</a>
            </li>
            <li>
                <a class="nav-link selected" href="/admin">ADMIN</a>
            </li>
            <li>
                <img src="icon.jpg" alt="Login" id="userIcon">
            </li>
        </ul>
        
    </div>
    <div class="container text-center">
       
       
        <div class="bookItem">
            <div class="titleSpace">
                <h2 class="bookTitle">add new Book</h2>
            </div>

            <div class="addButtonSpace">
                <button> + </button>
            </div>
        </div>
        <div class="row">

            <div class="col">

            </div>

            @foreach ($books as $book)
            <div class="col">
                <div class="bookItem">
                    <div class="titleSpace">
                        <h2 class="bookTitle">{{$book->name}}</h2>
                    </div>
                    <div class="infoSpace">
                        <a class="autor"> {{$book->autor}} {{$book->releaseDate}}</a>
                        @if($book->isBorrowed)
                            <div class= "availableItem info">
                                <img class = "notAvailableImg" alt="na"> 
                                <a> UserID: {{$book->borrowedFrom}} </a>  
                            </div>
                            <div class="borrowedAt info" >
                                <img class = "borrowedAtImg" alt=">>"> 
                                <a>{{$book->borrowedAt}} </a>  
                            </div>

                        @else
                            <div class="borrowedFrom info" >
                                <img class = "availableImg" alt="av"> 
                                <a> UserID: {{$book->borrowedFrom}} </a> 
                            </div> 
                            <div class="borrowedAt info" >
                                <img class = "borrowedAtImg" alt=">>"> 
                                <a>{{$book->borrowedAt}} </a>  
                            </div>
                            <div class="ruternedAt info">
                                <img class = "borrowedFromImg" alt="<<"> 
                                <a>{{$book->returnedAt}}</a>
                            </div>
                        @endIf
                    </div>
                    <div class="buttonSpace">
                        <button> edit </button>
                        <button> delete </button>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</body>
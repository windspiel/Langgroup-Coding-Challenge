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
                <a class="nav-link selected">BORROW</a>
            </li>
            <li>
                <a class="nav-link">RETURN</a>
            </li>
            <li>
                <a class="nav-link">ADMIN</a>
            </li>
            <li>
                <img src="img_girl.jpg" alt="Login" id="userIcon">
            </li>
        </ul>
        
    </div>
    <div class="container text-center">
        <div class="row">
            <div class="col">
                <div class="bookItem">
                    <h2 class="bookTitle">How to be succesful</h2>
                    <a class="autor"> John Doe</a>
                    <a class="release"> 12.06.1998</a>
                    <div class= notAvailable> 
                    <img class = "notAvailableImg"> 
                        <a> not available </a> 
                        <button> Borrow </button>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="bookItem">
                    <h2 class="bookTitle">How to be succesful</h2>
                    <a class="autor"> John Doe</a>
                    <a class="release"> 12.06.1998</a>
                    <div class= notAvailable> 
                        <img class = "notAvailableImg"> 
                        <a> not available </a>
                    </div>
                    <button> Borrow </button>
                </div>
            </div>
            <div class="col">
                <div class="bookItem">
                    <h2 class="bookTitle">How to be succesful</h2>
                    <a class="autor"> John Doe</a>
                    <a class="release"> 12.06.1998</a>
                    <div class= notAvailable> 
                    <img class = "notAvailableImg"> 
                        <a> not available </a> 
                        <button> Borrow </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
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
        <style>
        </style>
    </head>
<body>
    <div id="header">
        <h1>LIBARY</h1>
        <ul>
            <li class="underlined">
                <p>BORROW</p>
            </li>
            <li >
                <p>RETURN</p>
            </li>
            <li>
                <p>ADMIN</p>
            </li>
        </ul>
        <img src="img_girl.jpg" alt="Girl in a jacket" id="userIcon">
    </div>

    <div class="container text-center">
        <div class="row">
          <div class="col">
            <h2 class="bookTitle">How to be succesful</h2>
            <a class="autor"> John Doe</a>
            <a class="release"> 12.06.1998</a>
          <div class= available> 
            <img class = "availableImg"> 
            <a>
                available
            </a> 
            <button>
                Borrow
            </button>
        </div>


          </div>
          <div class="col">
            Book2
          </div>
          <div class="col">
            Book3
          </div>
        </div>
      </div>

 <div id="bookshelve">


 </div>
</body>
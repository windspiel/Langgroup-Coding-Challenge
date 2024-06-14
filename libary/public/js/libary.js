function navHome()
{
    //get href="/"
}

function borrowBook(bookId, userId)
{
    //Post -> controller BorrowBook(bookId, userId)
}

function borrowBook(bookId)//userId
{
    alert(""+bookId)
    //Post -> controller BorrowBook(bookId, userId)
}
function returnBook(bookId)
{
    alert(bookId);
    //post-> controller returnBook(bookId)
}
function openAddNewBook()
{
    //newBook()
    alert("openAddNewBook");
}

function addNewBook()
{
    alert("newBook");
    //newBook(name,autor,release)
}
function openEditBook(bookId)
{
    alert(bookId);
}
function editBook(bookId)//name, autor, release
{
    alert(bookId);
}
function deleteBook(bookId)
{
    alert(bookId);
}

function openPopUp()
{
  
    document.getElementById('popUp').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}
function closePopUp()
{
    document.getElementById('popUp').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}






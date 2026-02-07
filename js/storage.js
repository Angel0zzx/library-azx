export function loadBooks() {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.map(book => ({
        ...book,
        isFavorite: book.isFavorite ?? false
    }));
    return books;
}

export function saveBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
}
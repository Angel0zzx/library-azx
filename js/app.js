import { loadBooks, saveBooks } from './storage.js';
import { escapeHTML } from './utils.js';



let books = loadBooks();



function addBook() {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('author').value.trim();
    const status = document.getElementById('state').value.trim();
    
    if (!title || !author || !status) {
        alert("Please fill in all fields");
        return;
    }
    
    const exists = books.some(b =>
        b.title.toLowerCase() === title.toLowerCase() &&
        b.author.toLowerCase() === author.toLowerCase()
    );
    
    if (exists) {
        alert("This book already exists in your library");
        return;
    }
    
    const newBook = {
        id: crypto.randomUUID(),
        title: title,
        author: author,
        status: status,
        isFavorite: false
    };
    
    books.push(newBook);
    saveBooks(books);
    renderBooks();
    document.getElementById('book-form').reset();
}

function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) return;
    
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveBooks(books);
        renderBooks();
    }
}

function toggleFavorite(id) {
    const book = books.find(book => book.id === id);
    if (book) {
        book.isFavorite = !book.isFavorite;
        saveBooks(books);
        renderBooks();
    }
}

function changeStatus(id, newStatus) {
    const book = books.find(book => book.id === id);
    if (book) {  
        book.status = newStatus;
        saveBooks(books);
        renderBooks();
    }
}



function renderBooks() {
    const booksGrid = document.getElementById('books-grid');
    
    if (books.length === 0) {
        booksGrid.innerHTML = '<p class="empty-state">No books yet. Add one!</p>';
        return;
    }
    
    booksGrid.innerHTML = books.map(book => `
    <div class="book-card">
        <h3>${escapeHTML(book.title)}</h3>
        <p><strong>Author:</strong> ${escapeHTML(book.author)}</p>
        <select class="status-select" data-id="${book.id}">
            <option value="to-read" ${book.status === 'to-read' ? 'selected' : ''}>📚 To Read</option>
            <option value="reading" ${book.status === 'reading' ? 'selected' : ''}>📖 Reading</option>
            <option value="read" ${book.status === 'read' ? 'selected' : ''}>✅ Read</option>
        </select>
        <div class="book-card-actions">
            <button class="favorite-btn" data-id="${book.id}">
                ${book.isFavorite ? '❤️' : '🤍'}
            </button>
            <button class="delete-btn" data-id="${book.id}">Delete</button>
        </div>
    </div>
`).join('');
}



document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
});

document.getElementById('books-grid').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        deleteBook(id);
    }
    
    if (e.target.classList.contains('favorite-btn')) {
        const id = e.target.dataset.id;
        toggleFavorite(id);
    }
});

document.getElementById('books-grid').addEventListener('change', (e) => {
    if (e.target.classList.contains('status-select')) {
        const id = e.target.dataset.id;
        const newStatus = e.target.value;
        changeStatus(id, newStatus);
    }
});

renderBooks();
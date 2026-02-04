const books = JSON.parse(localStorage.getItem("books")) || [];

function saveToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
        status: status
    };

    books.push(newBook);
    saveToLocalStorage();
    renderBooks();

    document.getElementById('book-title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('state').value = "";
}

function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) return;

    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveToLocalStorage();
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
            <p><strong>Status:</strong> ${book.status}</p>
            <button class="delete-btn" data-id="${book.id}">Delete</button>
        </div>
    `).join('');
}

document.getElementById('books-grid').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        deleteBook(id);
    }
});

renderBooks();

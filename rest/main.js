const apiUrl = 'https://book-information-c2239-default-rtdb.asia-southeast1.firebasedatabase.app/book-information';

function clearForm() {
  document
    .querySelectorAll('#title, #author, #language')
    .forEach((input) => (input.value = ''));

  document.querySelector('#genre').value = 'Drama';
  document.querySelector('#shelf').value = 'Want To Read';
}

function resetForm() {
  const submitButton = document.querySelector('#book_form button');
  submitButton.innerText = 'Submit';
  submitButton.onclick = createBook;
  clearForm();
}

function readBooks() {
  fetch(`${apiUrl}.json`)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector('#table_body');
      tableBody.innerHTML = '';

      if (!data) return;

      Object.entries(data).forEach(([bookId, book]) => {
        const row = tableBody.insertRow();

        ['title', 'author', 'language', 'genre', 'shelf'].forEach((key) => {
          const cell = row.insertCell();
          cell.innerHTML = book[key] || '';
        });

        const actionsCell = row.insertCell();
        actionsCell.appendChild(
          createButton('Update', () => updateBook(bookId, book))
        );
        actionsCell.appendChild(
          createButton('Delete', () => deleteBook(bookId))
        );
      });
    })
    .catch((error) => console.error('Error reading data:', error.message));
}

function createBook() {
  const bookData = {
    title: getValue('#title'),
    author: getValue('#author'),
    language: getValue('#language'),
    genre: getValue('#genre'),
    shelf: getValue('#shelf')
  };

  fetch(`${apiUrl}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  })
    .then(() => readBooks())
    .catch((error) => console.error('Error:', error));

  clearForm();
}

function performUpdate(bookId) {
  const bookData = {
    id: bookId,
    title: getValue('#title'),
    author: getValue('#author'),
    language: getValue('#language'),
    genre: getValue('#genre'),
    shelf: getValue('#shelf')
  };

  fetch(`${apiUrl}/${bookId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  })
    .then(() => readBooks())
    .catch((error) => console.error('Error:', error));
    
  resetForm();
}

function deleteBook(bookId) {
  fetch(`${apiUrl}/${bookId}.json`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(() => readBooks())
    .catch((error) => console.error('Delete Error:', error));
}

function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

function updateBook(bookId, book) {
  ['genre', 'shelf'].forEach((id) =>
    document
      .querySelector(`#${id}`)
      .removeEventListener('change', validateForm)
  );

  setValue('#book_id', bookId);
  Object.keys(book).forEach((key) => setValue(`#${key}`, book[key]));

  const createButton = document.querySelector('#book_form button');
  createButton.textContent = 'UPDATE';
  createButton.onclick = () => performUpdate(bookId);

  ['genre', 'shelf'].forEach((id) =>
    document.querySelector(`#${id}`).addEventListener('change', validateForm)
  );
}

function setValue(selector, value) {
  document.querySelector(selector).value = value;
}

function getValue(selector) {
  return document.querySelector(selector).value;
}

function validateForm() {
  const isValid = ['title', 'author', 'language', 'genre', 'shelf'].every(
    (id) => document.querySelector(`#${id}`).value.trim() !== ''
  );

  const submitButton = document.querySelector('#book_form button');
  submitButton && (submitButton.disabled = !isValid);

  return isValid;
}

document.addEventListener('DOMContentLoaded', () => {
  readBooks();

  const bookForm = document.querySelector('#book_form');

  if (!bookForm) {
    console.error('Error: Book form not found.');
    return;
  }

  bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    validateForm()
      ? document.querySelector('#book_id').value
        ? performUpdate(document.querySelector('#book_id').value)
        : createBook()
      : null;
  });

  ['title', 'author', 'language', 'genre', 'shelf'].forEach((id) =>
    document.querySelector(`#${id}`).addEventListener('input', validateForm)
  );

  validateForm();
});

const apiUrl = "https://projectvrzn.online/api/rest_api.php";

document.addEventListener("DOMContentLoaded", () => {
  readBooks();

  const bookForm = document.querySelector("#book_form");

  if (bookForm) {
    bookForm.addEventListener("submit", (event) => {
      event.preventDefault();
      validateForm()
        ? document.querySelector("#book_id").value
          ? performUpdate()
          : createBook()
        : null;
    });

    ["title", "author", "language", "genre", "shelf"].forEach((id) => {
      document.querySelector(`#${id}`).addEventListener("input", validateForm);
    });

    validateForm();
  } else {
    console.error("Error: Book form not found.");
  }
});

function validateForm() {
  const formInputs = ["title", "author", "language", "genre", "shelf"];
  const isValid = formInputs.every(
    (id) => document.querySelector(`#${id}`).value.trim() !== ""
  );

  const submitButton = document.querySelector("#book_form button");
  submitButton && (submitButton.disabled = !isValid);

  return isValid;
}

function createBook() {
  const bookData = {
    title: getValue("#title"),
    author: getValue("#author"),
    language: getValue("#language"),
    genre: getValue("#genre"),
    shelf: getValue("#shelf"),
    action: "POST",
  };

  fetchAndHandle(apiUrl, "POST", bookData);
}

function performUpdate() {
  const bookData = {
    id: getValue("#book_id"),
    title: getValue("#title"),
    author: getValue("#author"),
    language: getValue("#language"),
    genre: getValue("#genre"),
    shelf: getValue("#shelf"),
    action: "PATCH",
  };

  fetchAndHandle(apiUrl, "POST", bookData);
}

function deleteBook(bookId) {
  const bookData = {
    id: bookId,
    action: "DELETE",
  };

  fetchAndHandle(apiUrl, "POST", bookData);
}

function fetchAndHandle(url, method, data) {
  const formData = new FormData();

  for (const key in data) {
    formData.append(key, data[key]);
  }

  fetch(url, {
    method: method,
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => handleResponse(data))
    .catch((error) => {
      console.error(
        `Error ${
          method === "POST"
            ? "creating"
            : method === "PATCH"
            ? "updating"
            : "deleting"
        } book:`,
        error.message
      );
      handleResponse({
        message: `Error ${
          method === "POST"
            ? "creating"
            : method === "PATCH"
            ? "updating"
            : "deleting"
        } book. Please try again.`,
      });
    });
}

function handleResponse(data) {
  const outputElement = document.querySelector("#output");
  outputElement && (outputElement.innerHTML = data.message);

  readBooks();
  resetForm();
}

function readBooks() {
  fetch(apiUrl)
    .then((response) =>
      response.ok
        ? response.json()
        : Promise.reject(`HTTP error! Status: ${response.status}`)
    )
    .then((data) => {
      const tableBody = document.querySelector("#table_body");

      if (tableBody) {
        tableBody.innerHTML = "";

        data.forEach((book) => {
          const row = tableBody.insertRow();

          for (const key in book) {
            const cell = row.insertCell();
            cell.innerHTML = book[key] || "";
          }

          const actionsCell = row.insertCell();
          const updateButton = createButton("Update", () => updateBook(book));
          const deleteButton = createButton("Delete", () =>
            deleteBook(book.id)
          );
          actionsCell.appendChild(updateButton);
          actionsCell.appendChild(deleteButton);
        });
      }

      const outputElement = document.querySelector("#output");
      outputElement && (outputElement.innerHTML = "");
    })
    .catch((error) => {
      console.error("Error reading books:", error.message);
    });
}

function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

function updateBook(book) {
  document.querySelector("#genre").removeEventListener("change", validateForm);
  document.querySelector("#shelf").removeEventListener("change", validateForm);

  setValue("#book_id", book.id);
  setValue("#title", book.title);
  setValue("#author", book.author);
  setValue("#language", book.language);
  setValue("#genre", book.genre);
  setValue("#shelf", book.shelf);

  const createButton = document.querySelector("#book_form button");
  createButton.textContent = "UPDATE";
  createButton.onclick = performUpdate;

  document.querySelector("#genre").addEventListener("change", validateForm);
  document.querySelector("#shelf").addEventListener("change", validateForm);
}

function setValue(selector, value) {
  document.querySelector(selector).value = value;
}

function getValue(selector) {
  return document.querySelector(selector).value;
}

function resetForm() {
  const bookForm = document.querySelector("#book_form");

  if (bookForm) {
    bookForm.reset();
    const createButton = document.querySelector("#book_form button");

    if (createButton) {
      createButton.textContent = "Submit";
      createButton.onclick = createBook;
    }
  } else {
    console.error("Error resetting form: Book form not found.");
  }
}

let form = document.querySelector('#item_form');
let fullNameInput = document.querySelector('#full_name');
let idInput = document.querySelector('#id');
let addButton = document.querySelector('#add_button');
let itemList = document.querySelector('#item_list');

function updateButtonState() {
  let fullName = fullNameInput.value.trim();
  let id = idInput.value.trim();
  addButton.disabled = !(fullName && id && idInput.validity.valid);
}

fullNameInput.addEventListener('input', updateButtonState);
idInput.addEventListener('input', updateButtonState);

addButton.addEventListener('click', () => {
  let fullName = fullNameInput.value.trim();
  let id = idInput.value.trim();

  if (fullName && id) {
    let item = document.createElement('li');
    item.className = 'item';
    item.innerHTML = `
      <div class="item-text">${fullName} (ID: ${id})</div>
      <button class="delete-button">Delete</button>
    `;
    itemList.appendChild(item);

    fullNameInput.value = '';
    idInput.value = '';
    addButton.disabled = true;

    let deleteButton = item.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
      itemList.removeChild(item);
    });
  }
});

updateButtonState();

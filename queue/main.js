let customerQueue = [];

function addToQueue() {
  const nameInput = document.querySelector('#name');
  const priorityInput = document.querySelector('#priority');

  const name = nameInput.value.trim();
  const priority = parseInt(priorityInput.value);

  if (!name || isNaN(priority)) return;

  const customer = { name, priority };
  customerQueue.push(customer);

  document.querySelector('#customer-form').reset();
  updateButtonState();
}

function processCustomer() {
  const customerInfo = document.querySelector('#customer_info');

  if (!customerQueue.length) {
    customerInfo.innerText = 'Queue is empty.';
    return;
  }

  const highestPriorityCustomer = customerQueue.reduce((prev, current) =>
    prev.priority > current.priority ? prev : current
  );

  customerInfo.innerText = `Processing Customer:
    Name: ${highestPriorityCustomer.name}
    Priority: ${highestPriorityCustomer.priority}`;

  const indexToRemove = customerQueue.indexOf(highestPriorityCustomer);
  customerQueue.splice(indexToRemove, 1);
}

function updateButtonState() {
  const nameInput = document.querySelector('#name');
  const priorityInput = document.querySelector('#priority');
  const addButton = document.querySelector('#add_button');

  addButton.disabled = !(
    nameInput.value.trim() &&
    priorityInput.value.trim() &&
    priorityInput.value.trim().match(/\S+/)
  );
}

document.querySelector('#name').addEventListener('input', updateButtonState);
document
  .querySelector('#priority')
  .addEventListener('input', updateButtonState);

updateButtonState();

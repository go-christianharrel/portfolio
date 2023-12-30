function checkNumber() {
  let numberInput = document.getElementById('number_input');
  let checkResultElement = document.getElementById('check_result');
  let number = parseInt(numberInput.value);

  if (!isNaN(number)) {
    if (number % 2 === 0) {
      checkResultElement.innerText = `${number} is an even number.`;
    } else {
      checkResultElement.innerText = `${number} is an odd number.`;
    }
  } else {
    checkResultElement.style.color = 'red';
    checkResultElement.innerText = 'Please enter a valid number.';
  }
}

function generateFibonacci() {
  let fibonacciNumberInput = document.getElementById('fibonacci_input');
  let fibonacciResultElement = document.getElementById('fibonacci_result');

  let number = parseInt(fibonacciNumberInput.value);
  if (!isNaN(number) && number >= 0) {
    let fibonacciSequence = generateFibonacciSequence(number);
    fibonacciResultElement.textContent = fibonacciSequence.join(', ');
  } else {
    fibonacciResultElement.style.color = 'red';
    fibonacciResultElement.textContent =
      'Please enter a valid number (greater than or equal to 0).';
  }
}

function generateFibonacciSequence(n) {
  let sequence = [];
  for (let i = 0; i <= n; i++) {
    if (i <= 1) {
      sequence.push(i);
    } else {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
  }
  return sequence;
}

function calculateFactorial() {
  let factInput = document.getElementById('fact_input');
  let factResultElement = document.getElementById('fact_result');

  let number = parseInt(factInput.value);

  if (!isNaN(number)) {
    if (number < 0) {
      factResultElement.textContent =
        'Factorial is undefined for negative numbers.';
    } else if (number === 0) {
      factResultElement.textContent = 'Factorial of 0 is 1.';
    } else {
      let factorial = 1;
      for (let i = 1; i <= number; i++) {
        factorial *= i;
      }
      factResultElement.textContent = `Factorial of ${number} is ${factorial}.`;
    }
  } else {
    factResultElement.style.color = 'red';
    factResultElement.textContent = 'Please enter a valid number.';
  }
}

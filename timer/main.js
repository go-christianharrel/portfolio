let timerDisplay = document.querySelector("#timer");
let startButton = document.querySelector("#start_button");
let pauseButton = document.querySelector("#pause_button");
let resumeButton = document.querySelector("#resume_button");
let stopButton = document.querySelector("#stop");

let intervalId;
let seconds = 0;
let isRunning = false;

function updateTimerDisplay() {
  timerDisplay.innerText = `${seconds} second/s`;
}

function toggleButtons(start, pause, resume, stop) {
  startButton.disabled = start;
  pauseButton.disabled = pause;
  resumeButton.disabled = resume;
  stopButton.disabled = stop;
}

function startTimer() {
  if (!isRunning) {
    intervalId = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1000);
    isRunning = true;
    toggleButtons(true, false, true, false);
  }
}

function pauseTimer() {
  if (isRunning) {
    clearInterval(intervalId);
    isRunning = false;
    toggleButtons(true, true, false, false);
  }
}

function resumeTimer() {
  if (!isRunning) {
    startTimer();
  }
}

function stopTimer() {
  clearInterval(intervalId);
  seconds = 0;
  updateTimerDisplay();
  isRunning = false;
  toggleButtons(false, true, true, true);
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resumeButton.addEventListener("click", resumeTimer);
stopButton.addEventListener("click", stopTimer);

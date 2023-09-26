// Starting variable initialization

// Designates the time at which we change the color of the timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

// The colors that the timer will take
const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};
let audio = new Audio("Ressources/ping.mp3");
let workPhase = new Boolean(true);
let restButton = document.getElementById("restButton");
let workButton = document.getElementById("workButton");
restButton.disabled = true; // initialization of info button
let startButton = document.getElementById("start");
let timePassed = 0; // Point out the time that has passed
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color; // default timer color

let workTime = 25 * 60; // Default work time
let restTime = 5 * 60; // Default rest time
let currentTime = workTime ; // Designates the timer time at launch
let timeLeft = currentTime; // Designate the remaining time


// Print the timer
document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

// Function to start tme with button
function start() {
    startButton.innerHTML =  `<button class="reset" onclick="reinitialisation()" >Reset</button>`;
    timePassed = 0;
    currentTime = workTime;
    timeLeft = currentTime;
    clearInterval(timerInterval);
    startTimer();
}

// Function to reset time
function reinitialisation(){
  console.log('reini');
  startButton.innerHTML =  `<button class="reset" onclick="start()">Start</button>`;
  timePassed = 0;
  clearInterval(timerInterval);
  currentTime = workTime ;
  timeLeft = currentTime;
  document.getElementById("base-timer-label").innerHTML = formatTime(
    timeLeft
  );
  restButton.disabled = true;
  workButton.disabled = false;
  workPhase = true;
  setCircleDasharray();
  setRemainingPathColor(timeLeft);
}

// Function to personalize times
function update(){
  let minutesT = document.getElementById("minutesT").value;
  let secondesT = document.getElementById("secondesT").value;
  let minutesR = document.getElementById("minutesR").value ;
  let secondesR = document.getElementById("secondesR").value;
  let myRegex = /^[0-9]+$/;

  if(minutesT == "" && secondesT != "" && myRegex.test(secondesT)){
    workTime = parseInt(secondesT);
  }else if(minutesT != "" && secondesT == "" && myRegex.test(minutesT)){
    workTime = parseInt(minutesT * 60);
  }else if(minutesT != "" && secondesT && myRegex.test(secondesT) && myRegex.test(minutesT)){
    workTime = parseInt(minutesT) * 60 + parseInt(secondesT);
  }

  if(minutesR == "" && secondesR != "" && myRegex.test(secondesR)){
    restTime = parseInt(secondesR);
  }else if(minutesR != "" && secondesR == "" && myRegex.test(minutesR)){
    restTime = parseInt(minutesR * 60);
  }else if(minutesR != "" && secondesR != "" && myRegex.test(secondesR) && myRegex.test(minutesR)){
    restTime = parseInt(minutesR) * 60 + parseInt(secondesR);
  }

  // console.log("----------------Actualisation--------------------");
  // console.log("Travail " + minutesT + ":" + secondesT);
  // console.log("Repos " + minutesR + ":" + secondesR);
  // console.log("temps du chrono en sec : " + currentTime);

  currentTime = workTime ;
  timeLeft = currentTime;
  timePassed = 0;
  clearInterval(timerInterval);
  startButton.innerHTML =  `<button class="start" onclick="start()">Start</button>`;
  document.getElementById("base-timer-label").innerHTML = formatTime(
    timeLeft
  );
  minutesT = 0;
  secondesT = 0;
  minutesR = 0;
  secondesR = 0;
  printForm();
}

// Function to change phase (timer time) between working phase and rest phase
function phaseChange(){
  console.log(workPhase);
  if (workPhase != true){
    currentTime = workTime + 1; // plus 1 because the first second is consumed instantly
    restButton.disabled = true;
    workButton.disabled = false;
    workPhase = true;
  }else {
    currentTime = restTime + 1; // plus 1 because the first second is consumed instantly
    workButton.disabled = true;
    restButton.disabled = false;
    workPhase = false;
  }
}

// Triggered when time reaches 0
function onTimesUp() {
  audio.play();
  timePassed = 0;
  timeLeft = currentTime;
  clearInterval(timerInterval);
  phaseChange();
  startTimer();
}

// start the timer
function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = currentTime - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft <= 0) {
      onTimesUp();
    }
  }, 1000);
}

// Format the timer in minutes and seconds
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}


// Change the color of the timer depending on the time remaining
function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }else{
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(alert.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  }
}

// Calculate the portion of the circle to color
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / currentTime;
  return rawTimeFraction - (1 / currentTime) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

// Print the update form panel
function printForm(){
  let myForm = document.getElementById("myForm");
  myForm.innerHTML = `<img id="close" onclick="removeForm()" src="Ressources/close.png" alt="Image fermeture fenetre"/>   
  <h3>Work time</h3>
  <label for="minutesT">Min</label>
  <input type="number" name="minutes" id="minutesT" min="0" value="${Math.floor(workTime / 60)}">
  <label for="secondesT">Sec</label>
  <input type="number" name="secondes" id="secondesT" min="0" value="${workTime % 60}">
  <br><br>
  <h3>Rest time</h3>
  <label for="minutesR">Min</label>
  <input type="number" name="minutes" id="minutesR" min="0" value="${Math.floor(restTime / 60)}">
  <label for="secondesR">Sec</label>
  <input type="number" name="secondes" id="secondesR" min="0" value="${restTime % 60}">
  <br><br>
  <button class="update" onclick="update()">Update</button>`;
}


// Remove the update form panel
function removeForm(){
  // console.log("retire form");
  let myForm = document.getElementById("myForm");
  myForm.innerHTML = '';
}

// Print the information panel
function PrintInfo(){
  let myInfo = document.getElementById("myInfo");
  myInfo.innerHTML = `<img id="close" onclick="removeInfo()" src="Ressources/close.png" alt="Image fermeture fenetre"/>   
  <h3>Work time</h3>
  <p>${Math.floor(workTime / 60)} : ${workTime % 60}<p>
  <br><br>
  <h3>Rest time</h3>
  <p>${Math.floor(restTime / 60)} : ${restTime % 60}<p>`;
}

// Remove the information panel
function removeInfo(){
  // console.log("retire info");
  let myInfo = document.getElementById("myInfo");
  myInfo.innerHTML = ``;
}





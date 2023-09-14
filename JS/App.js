// Initialisation variable de départ

// Designe le temps auquel on change la couleur du timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

// Lest couleurs que va prendre le timer
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

let phaseTravaille = new Boolean(true);
let buttonRep = document.getElementById("buttonRep");
let buttonTra = document.getElementById("buttonTra");
buttonRep.disabled = true;
let minDebut = 1 * 60; // Designe le temps du timer au lancement
let timePassed = 0; // Designe le temps qui c'est écoulé
let timeLeft = minDebut; // Designe le temps restant
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

// Fonction pour changer de phase(temps timer) entre phase travaille et phase repos
function changementPhase(){
    phaseTravaille = !phaseTravaille;
    if (phaseTravaille === true){
        minDebut = 2 * 60;
        buttonRep.disabled = true;
        buttonTra.disabled = false;
    }else {
        minDebut = 1 * 60;
        buttonTra.disabled = true;
        buttonRep.disabled = false;
    }
}

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

startTimer();

// Permet d'actualiser le timer avec un nouveau temps personnalisé
function actualiser(){
  let myMinutes = document.getElementById("minutes").value;
  let mySecondes = document.getElementById("secondes").value;
  
  console.log(myMinutes + " : " +  mySecondes);

}

// Declanché lorsque le temps arrive à 0
function onTimesUp() {
  timePassed = 0;
  timeLeft = minDebut;
  clearInterval(timerInterval);
  changementPhase();
  startTimer();
}

// Lancement timer
function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = minDebut - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

// Formate le timer en minute et seconde
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}


// Change la couleur du timer en fonction du temps qu'il reste
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

// Calcule la portion du cercle à colorer
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / minDebut;
  return rawTimeFraction - (1 / minDebut) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
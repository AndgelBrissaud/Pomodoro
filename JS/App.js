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
let buttonStart = document.getElementById("start");
let timePassed = 0; // Designe le temps qui c'est écoulé
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

let tempsTra = 25 * 60;
let tempsRep = 5 * 60;
let tempsActu = tempsTra ; // Designe le temps du timer au lancement
let timeLeft = tempsActu; // Designe le temps restant

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

document.getElementById("start").addEventListener("click", () => {
    buttonStart.innerHTML =  `<button class="reinisialisation" id="start">Reinisialiser</button>`;
    timePassed = 0;
    timeLeft = tempsActu;
    clearInterval(timerInterval);
    tempsActu = tempsTra + 1;
    startTimer();
});

// Fonction pour personnaliser les temps
function actualiser(){
  let minutesT = document.getElementById("minutesT").value;
  let secondesT = document.getElementById("secondesT").value;
  let minutesR = document.getElementById("minutesR").value ;
  let secondesR = document.getElementById("secondesR").value;
  let myRegex = /^[1-9]+$/;

  if(minutesT == "" && secondesT != "" && myRegex.test(secondesT)){
    tempsTra = parseInt(secondesT);
  }else if(minutesT != "" && secondesT == "" && myRegex.test(minutesT)){
    tempsTra = parseInt(minutesT * 60);
  }else if(minutesT != "" && secondesT && myRegex.test(secondesT) && myRegex.test(minutesT)){
    tempsTra = parseInt(minutesT) * 60 + parseInt(secondesT);
  }

  if(minutesR == "" && secondesR != "" && myRegex.test(secondesR)){
    tempsRep = parseInt(secondesR);
  }else if(minutesR != "" && secondesR == "" && myRegex.test(minutesR)){
    tempsRep = parseInt(minutesR * 60);
  }else if(minutesR != "" && secondesR != "" && myRegex.test(secondesR) && myRegex.test(minutesR)){
    tempsRep = parseInt(minutesR) * 60 + parseInt(secondesR);
  }

  // console.log("----------------Actualisation--------------------");
  // console.log("Travail " + minutesT + ":" + secondesT);
  // console.log("Repos " + minutesR + ":" + secondesR);
  // console.log("temps du chrono en sec : " + tempsActu);

  tempsActu = tempsTra + 1; // plus 1 car la premiere seconde est consommer instantanement
  timeLeft = tempsActu;
  timePassed = 0;
  clearInterval(timerInterval);
  startTimer();
  minutesT = 0;
  secondesT = 0;
  minutesR = 0;
  secondesR = 0;
  document.getElementById("minutesT").value = '';
  document.getElementById("secondesT").value = '';
  document.getElementById("minutesR").value = '';
  document.getElementById("secondesR").value = '';
}

// Fonction pour changer de phase(temps timer) entre phase travaille et phase repos
function changementPhase(){
    phaseTravaille = !phaseTravaille;
    if (phaseTravaille === true){
        tempsActu = tempsTra + 1; // plus 1 car la premiere seconde est consommer instantanement
        // console.log(tempsActu);
        buttonRep.disabled = true;
        buttonTra.disabled = false;
        phaseTravaille = false;
    }else {
        tempsActu = tempsRep + 1; // plus 1 car la premiere seconde est consommer instantanement
        // console.log(tempsActu);
        buttonTra.disabled = true;
        buttonRep.disabled = false;
        phaseTravaille = true;
    }
}

// Declanché lorsque le temps arrive à 0
function onTimesUp() {
  timePassed = 0;
  timeLeft = tempsActu;
  clearInterval(timerInterval);
  changementPhase();
  startTimer();
}

// Lancement timer
function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = tempsActu - timePassed;
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
  const rawTimeFraction = timeLeft / tempsActu;
  return rawTimeFraction - (1 / tempsActu) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}








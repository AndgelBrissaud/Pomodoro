// Initialisation variable de départ
let phaseTravaille = new Boolean(true);
let minDebut = 25;
let temps = minDebut * 60;
let timer = document.getElementById("timer"); // Recupere la <div> timer du html.

// Fonction pour changer de phase(temps timer) entre phase travaille et phase repos
function changementPhase(){
    phaseTravaille = !phaseTravaille;
    if (phaseTravaille === true){
        minDebut = 25;
        temps = minDebut * 60;
    }else {
        minDebut = 5;
        temps = minDebut * 60;
    }
}

// Fonction timer
setInterval( () => {

    // Initialisation des variable
    let minutes = parseInt(temps / 60, 10);
    let secondes = parseInt(temps % 60, 10);

    if (minutes == 0 && secondes-1 == 0){
        changementPhase();
    }

    // Calcule minutes et secondes
    minutes = minutes < 10 ? "0" + minutes : minutes;
    secondes = secondes < 10 ? "0" + secondes : secondes;

    timer.innerText = minutes + ":" + secondes; // Affichage du timer
    temps = temps <= 0 ? 0 : temps - 1; // Réduction du temps 
}, 1000);
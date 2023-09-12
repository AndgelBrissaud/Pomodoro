// Initialisation variable de départ
let minDebut = 25;
let temps = minDebut * 60;
let timer = document.getElementById("timer"); // Recupere la <div> timer du html.

// Fonction timer
setInterval( () => {
    // Initialisation des variable
    let minutes = parseInt(temps / 60, 10);
    let secondes = parseInt(temps % 60, 10);

    // Calcule minutes et secondes
    minutes = minutes < 10 ? "0" + minutes : minutes;
    secondes = secondes < 10 ? "0" + secondes : secondes;

    timer.innerText = minutes + ":" + secondes; // Affichage du timer
    temps = temps <= 0 ? 0 : temps - 1; // Réduction du temps
}, 1000);
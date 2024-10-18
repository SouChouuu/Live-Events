//Ajout d'animation
window.addEventListener("load", () => {
  document.querySelector(".video-container").classList.add("loaded");
});

// Date du début du festival
const festivalDate = new Date("2025-07-04T00:00:00").getTime();

const countdown = setInterval(() => {
  const now = new Date().getTime();
  const distance = festivalDate - now;

  // Calculer les jours restants
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  // Afficher le résultat dans l'élément avec l'ID countdownDays
  document.getElementById("countdownDays").innerText = days >= 0 ? days : 0;

  // Si le compte à rebours est terminé, afficher un message
  if (distance < 0) {
    clearInterval(countdown);
    document.getElementById("countdownDays").innerText = "0";
    // afficher un message ici
  }
}, 1000);

// PROGRAMMATION
// Charger le contenu du fichier JSON
document.addEventListener("DOMContentLoaded", function () {
  let concertsData = []; // Stocker les données pour pouvoir les filtrer
  const container = document.getElementById("concerts-container");

  // Fonction pour afficher les concerts
  function displayConcerts(concerts) {
    container.innerHTML = ""; // Vider l'affichage précédent

    concerts.forEach((scene) => {
      // Créer un titre pour chaque scène
      const sceneTitle = document.createElement("h2");
      sceneTitle.classList.add("text-center", "mt-5");
      sceneTitle.textContent = scene.nom;
      container.appendChild(sceneTitle);

      const row = document.createElement("div");
      row.classList.add("row");

      // Ajouter chaque concert de la scène
      scene.concerts.forEach((concert) => {
        const col = document.createElement("div");
        col.classList.add("col-md-4", "col-lg-3", "mb-4");

        const card = document.createElement("div");
        card.classList.add("card", "h-100");

        // Ajouter l'image de l'artiste
        const img = document.createElement("img");
        img.classList.add("card-img-top");
        img.src = concert.photo;
        img.alt = `Photo de ${concert.artiste}`;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-img-overlay");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = concert.artiste;

        const cardText1 = document.createElement("p");
        cardText1.classList.add("card-text");
        cardText1.textContent = `Le ${concert.date} à ${concert.horaire}`;

        const cardText2 = document.createElement("p");
        cardText2.classList.add("card-text");
        cardText2.textContent = `${concert.genre}`;

        const cardText3 = document.createElement("p");
        cardText3.classList.add("card-text");
        cardText3.textContent = `Lieu : ${concert.lieu}`;

        const button = document.createElement("a");
        button.classList.add(
          "btn",
          "btn-lg",
          "position-absolute",
          "bottom-0",
          "end-0"
        );
        button.textContent = "Acheter des billets";
        button.href = "#billets";

        // Ajout des éléments dans la carte
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText1);
        cardBody.appendChild(cardText2);
        //cardBody.appendChild(cardText3); On n'affiche plus le lieu sur la carte
        cardBody.appendChild(button);

        card.appendChild(img); // Ajouter l'image
        card.appendChild(cardBody); // Ajouter le contenu de la carte
        col.appendChild(card); // Ajouter la carte dans la colonne
        row.appendChild(col); // Ajouter la colonne dans la ligne
      });

      container.appendChild(row); // Ajouter la ligne dans le conteneur
    });
  }

  // Fonction pour filtrer les concerts
  function filterConcerts() {
    const artistFilter = document
      .getElementById("filter-artist")
      .value.toLowerCase();
    const dateFilter = document
      .getElementById("filter-date")
      .value.toLowerCase();
    const genreFilter = document
      .getElementById("filter-genre")
      .value.toLowerCase();
    const timeFilter = document
      .getElementById("filter-time")
      .value.toLowerCase();
    const locationFilter = document
      .getElementById("filter-location")
      .value.toLowerCase();

    const filteredData = concertsData.map((scene) => {
      const filteredConcerts = scene.concerts.filter((concert) => {
        const artistMatch = concert.artiste
          .toLowerCase()
          .includes(artistFilter);
        const dateMatch = concert.date.toLowerCase().includes(dateFilter);
        const genreMatch = concert.genre.toLowerCase().includes(genreFilter);
        const timeMatch = concert.horaire.toLowerCase().includes(timeFilter);
        const locationMatch = concert.lieu
          .toLowerCase()
          .includes(locationFilter);

        return (
          artistMatch && dateMatch && genreMatch && timeMatch && locationMatch
        );
      });

      return { ...scene, concerts: filteredConcerts };
    });

    displayConcerts(filteredData.filter((scene) => scene.concerts.length > 0));
  }

  // Attacher des écouteurs d'événements aux filtres
  document
    .getElementById("filter-artist")
    .addEventListener("input", filterConcerts);
  document
    .getElementById("filter-date")
    .addEventListener("input", filterConcerts);
  document
    .getElementById("filter-genre")
    .addEventListener("input", filterConcerts);
  document
    .getElementById("filter-time")
    .addEventListener("input", filterConcerts);
  document
    .getElementById("filter-location")
    .addEventListener("input", filterConcerts);

  // Charger les concerts depuis le fichier JSON
  fetch("Data/concerts.json")
    .then((response) => response.json())
    .then((data) => {
      concertsData = data.scenes; // Sauvegarder les données initiales
      displayConcerts(concertsData); // Afficher les concerts au démarrage
    });
});

// BILLETS
// Fonction pour charger les données JSON depuis le fichier billets.json
function chargerBillets() {
  fetch("Data/billets.json")
    .then((response) => response.json()) // Récupérer et convertir en JSON
    .then((data) => afficherBillets(data.billets)) // Passer les données au render
    .catch((error) =>
      console.error("Erreur lors du chargement des billets:", error)
    );
}

// Fonction pour afficher les billets dans la section billetterie
function afficherBillets(billets) {
  let sectionBilletterie = document.getElementById("billetterie");

  billets.forEach((billet) => {
    let billetHTML = `
          <div class="col-md-6 col-lg-3 mb-4">
              <div class="ticket  h-200">
                  <div class="ticket-body">
                      <h5 class="ticket-title text-center m-2">${
                        billet.titre
                      }</h5>
                      <p class="ticket-text m-2">${billet.description}</p>
                      <p class="ticket-text m-2"><strong>Prix :</strong> ${
                        billet.prix
                      } €</p>
                      <!-- Ajout de la sélection de quantité -->
                                <label class="ticket-text m-2" for="quantite-${
                                  billet.id
                                }"><strong>Quantité :</strong></label>
                                <select id="quantite-${
                                  billet.id
                                }" class="form-select">
                                    ${genererOptionsQuantite(billet.quantite)}
                                </select>
                      <button class="btn btn-lg ms-lg-3 m-3">Acheter</button>
                  </div>
              </div>
          </div>
      `;
    sectionBilletterie.innerHTML += billetHTML;
  });
}

// Fonction pour générer les options de sélection de quantité
function genererOptionsQuantite(maxQuantite) {
  let optionsHTML = "";
  for (let i = 1; i <= maxQuantite; i++) {
    optionsHTML += `<option value="${i}">${i}</option>`;
  }
  return optionsHTML;
}

// Charger les billets lors du chargement de la page
window.onload = chargerBillets;

// Initialiser la carte, centrée sur le Parc Monceau
var map = L.map("map", {
  fullscreenControl: true, // Ajout du contrôle plein écran
}).setView([48.879, 2.3087], 16); // Coordonnées du Parc Monceau

// Charger les tuiles de la carte OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Ajout d'un événement de clic sur la carte
map.on("click", function () {
  map.toggleFullscreen(); // Basculer le plein écran
});

// Gestion des événements d'entrée et de sortie du mode plein écran (facultatif)
map.on("enterFullscreen", function () {
  console.log("Vous êtes en mode plein écran");
});

map.on("exitFullscreen", function () {
  console.log("Vous avez quitté le mode plein écran");
});

// Ajouter des marqueurs aux points d'intérêt du site
var awesomeIcon = L.divIcon({
  html: '<i class="fas fa-microphone-alt" style="color: #FF4500; font-size: 30px;"></i>',
  iconSize: [30, 30],
  className: "", // Désactive la classe par défaut pour que l'icône ne soit pas affectée
});

L.marker([48.879308, 2.306204], { icon: awesomeIcon })
  .addTo(map)
  .bindPopup("Scène Asie");

L.marker([48.878472, 2.308026], { icon: awesomeIcon })
  .addTo(map)
  .bindPopup("Scène Afrique");

L.marker([48.878877, 2.310479], { icon: awesomeIcon })
  .addTo(map)
  .bindPopup("Scène Amérique du Nord");

L.marker([48.88034, 2.311015], { icon: awesomeIcon })
  .addTo(map)
  .bindPopup("Scène Amérique du Sud");

L.marker([48.879381, 2.309012], { icon: awesomeIcon })
  .addTo(map)
  .bindPopup("Scène Europe");

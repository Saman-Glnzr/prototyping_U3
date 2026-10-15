const app = document.querySelector("#app");

/* -------------------------------- */
/* TRAFIKVERKET API */
/* -------------------------------- */

const TRAFIKVERKET_API_KEY = "DIN_API_NYCKEL_HÄR";

const TRAFIKVERKET_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

/*
    Hur ofta kartan uppdateras.

    30000 = 30 sekunder.
*/

const TRAIN_REFRESH_TIME = 30000;

/* -------------------------------- */
/* GLOBALA VARIABLER */
/* -------------------------------- */

let trainMap = null;

let trainMarkerLayer = null;

let trainRefreshInterval = null;

/* -------------------------------- */
/* PERRONG DATA */
/* -------------------------------- */

const platforms = [
  {
    id: 1,

    title: "Perrong 1",

    description: "Tåg mot Växjö och Kalmar",

    crowd: "Lugn",
  },

  {
    id: 2,

    title: "Perrong 2",

    description: "Tåg mot Malmö och Köpenhamn",

    crowd: "Måttligt",
  },

  {
    id: 3,

    title: "Perrong 3",

    description: "Tåg mot Jönköping och Nässjö",

    crowd: "Lugn",
  },

  {
    id: 4,

    title: "Perrong 4",

    description: "Tåg mot Stockholm och Linköping",

    crowd: "Måttligt",
  },
];

/* -------------------------------- */
/* KLOCKA */
/* -------------------------------- */

function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString("sv-SE", {
    hour: "2-digit",

    minute: "2-digit",
  });

  const date = now.toLocaleDateString("sv-SE", {
    weekday: "long",

    day: "numeric",

    month: "long",
  });

  document.querySelector("#clock").textContent = time;

  document.querySelector("#date").textContent = date;
}

setInterval(updateClock, 1000);

updateClock();

/* -------------------------------- */
/* RENSA TÅGKARTA */
/* -------------------------------- */

function destroyTrainMap() {
  if (trainRefreshInterval) {
    clearInterval(trainRefreshInterval);

    trainRefreshInterval = null;
  }

  if (trainMap) {
    trainMap.remove();

    trainMap = null;
  }

  trainMarkerLayer = null;
}

/* -------------------------------- */
/* STARTSIDA */
/* -------------------------------- */

function renderHome() {
  destroyTrainMap();

  app.innerHTML = `

        <section class="hero">

            <h1>
                Utforska stationen medan du väntar.
            </h1>

            <p>
                Reseskärmen låter dig utforska
                stationens perronger eller se
                var aktiva tåg befinner sig
                i realtid.
            </p>

        </section>


        <section class="action-grid">


            <button
                class="action-card"
                id="platformButton"
            >

                <h2>
                    Utforska perrong
                </h2>

                <p>
                    Välj en perrong och se
                    vad som händer på
                    stationens olika perronger.
                </p>

                <span class="link-label">
                    Välj perrong
                </span>

            </button>


            <button
                class="action-card"
                id="trainButton"
            >

                <h2>
                    Utforska tåg
                </h2>

                <p>
                    Öppna tågkartan och
                    se var aktiva tåg
                    befinner sig just nu.
                </p>

                <span class="link-label">
                    Öppna tågkartan
                </span>

            </button>


        </section>

    `;

  const platformButton = document.querySelector("#platformButton");

  const trainButton = document.querySelector("#trainButton");

  platformButton.addEventListener("click", renderPlatforms);

  trainButton.addEventListener("click", renderTrainMap);
}

/* -------------------------------- */
/* SIDRUBRIK */
/* -------------------------------- */

function createPageHeading(title, text) {
  return `

        <section class="page-heading">


            <button
                class="home-button"
                id="homeButton"
            >

                Startsida

            </button>


            <div>

                <h1>
                    ${title}
                </h1>


                <p>
                    ${text}
                </p>

            </div>


        </section>

    `;
}

/* -------------------------------- */
/* PERRONGER */
/* -------------------------------- */

function renderPlatforms() {
  destroyTrainMap();

  app.innerHTML = `

        ${createPageHeading(
          "Välj en perrong",

          "Tryck på en perrong för att se vad som visas på den valda perrongen.",
        )}


        <section class="choice-grid">


            ${platforms
              .map(function (platform) {
                return `

                        <button
                            class="choice-card"
                            data-platform="${platform.id}"
                        >


                            <span class="number">

                                ${platform.id}

                            </span>


                            <h2>

                                ${platform.title}

                            </h2>


                            <p>

                                ${platform.description}

                            </p>


                            <p>

                                <strong>
                                    Aktuellt läge:
                                </strong>

                                ${platform.crowd}

                            </p>


                        </button>

                    `;
              })
              .join("")}


        </section>

    `;

  document.querySelector("#homeButton").addEventListener("click", renderHome);

  const buttons = document.querySelectorAll("[data-platform]");

  for (const button of buttons) {
    button.addEventListener("click", function () {
      const id = Number(button.dataset.platform);

      renderPlatformDetail(id);
    });
  }
}

/* -------------------------------- */
/* PERRONG DETALJ */
/* -------------------------------- */

function renderPlatformDetail(id) {
  const platform = platforms.find(function (item) {
    return item.id === id;
  });

  app.innerHTML = `

        ${createPageHeading(
          platform.title,

          "Här visas den valda perrongen.",
        )}


        <section class="detail-card">


            <div class="live-view">


                <span class="live-badge">

                    LIVE-VY

                </span>


                <div class="platform-sign">

                    ${platform.title}
                    •
                    Alvesta

                </div>


            </div>


            <div class="detail-body">


                <h2>

                    ${platform.title}

                </h2>


                <p>

                    ${platform.description}

                </p>


                <div class="info-grid">


                    <div class="info-box">

                        <span>
                            Aktuellt läge
                        </span>

                        <strong>

                            ${platform.crowd}

                        </strong>

                    </div>


                    <div class="info-box">

                        <span>
                            Station
                        </span>

                        <strong>
                            Alvesta C
                        </strong>

                    </div>


                    <div class="info-box">

                        <span>
                            Perrong
                        </span>

                        <strong>

                            ${platform.id}

                        </strong>

                    </div>


                </div>


                <div class="button-row">


                    <button
                        class="primary-button"
                        id="platformHomeButton"
                    >

                        Till startsidan

                    </button>


                    <button
                        class="secondary-button"
                        id="otherPlatformButton"
                    >

                        Välj annan perrong

                    </button>


                </div>


            </div>


        </section>

    `;

  document.querySelector("#homeButton").addEventListener("click", renderHome);

  document
    .querySelector("#platformHomeButton")
    .addEventListener("click", renderHome);

  document
    .querySelector("#otherPlatformButton")
    .addEventListener("click", renderPlatforms);
}

/* -------------------------------- */
/* TÅGKARTA */
/* -------------------------------- */

function renderTrainMap() {
  destroyTrainMap();

  app.innerHTML = `

        ${createPageHeading(
          "Tåg i realtid",

          "Kartan visar senast rapporterade position för aktiva tåg. Tryck på ett tåg på kartan för mer information.",
        )}


        <section class="train-map-layout">


            <div class="map-panel">


                <div
                    id="mapLoading"
                    class="map-loading"
                >

                    Hämtar tågpositioner...

                </div>


                <div id="trainMap">
                </div>


            </div>


            <aside
                class="map-side-panel"
            >


                <h2>
                    Live tågkarta
                </h2>


                <p>
                    Välj ett tåg direkt
                    på kartan för att se
                    information om tågets
                    position och hastighet.
                </p>


                <div class="map-status">

                    <span>
                        Senast uppdaterad
                    </span>

                    <strong
                        id="mapUpdated"
                    >
                        Hämtar data...
                    </strong>

                </div>


                <div
                    id="selectedTrain"
                    class="train-info-empty"
                >

                    Tryck på ett tåg
                    på kartan för
                    att visa detaljer.

                </div>


                <div class="button-row">


                    <button
                        class="secondary-button"
                        id="refreshTrainsButton"
                    >

                        Uppdatera karta

                    </button>


                    <button
                        class="secondary-button"
                        id="centerAlvestaButton"
                    >

                        Visa Alvesta

                    </button>


                </div>


            </aside>


        </section>

    `;

  document.querySelector("#homeButton").addEventListener("click", renderHome);

  document
    .querySelector("#refreshTrainsButton")
    .addEventListener("click", loadTrainPositions);

  document
    .querySelector("#centerAlvestaButton")
    .addEventListener("click", centerMapOnAlvesta);

  createTrainMap();

  loadTrainPositions();

  trainRefreshInterval = setInterval(loadTrainPositions, TRAIN_REFRESH_TIME);
}

/* -------------------------------- */
/* SKAPA LEAFLET KARTA */
/* -------------------------------- */

function createTrainMap() {
  /*
        Alvesta ungefärliga koordinater.
    */

  const alvestaLatitude = 56.899;

  const alvestaLongitude = 14.556;

  trainMap = L.map("trainMap", {
    zoomControl: true,
  }).setView([alvestaLatitude, alvestaLongitude], 7);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {
      maxZoom: 19,

      attribution: "&copy; OpenStreetMap",
    },
  ).addTo(trainMap);

  /*
        Markering av Alvesta station.
    */

  L.circleMarker(
    [alvestaLatitude, alvestaLongitude],

    {
      radius: 9,

      weight: 4,

      color: "#174f7c",

      fillColor: "#ffffff",

      fillOpacity: 1,
    },
  )
    .addTo(trainMap)
    .bindPopup("<strong>Alvesta station</strong>");

  trainMarkerLayer = L.layerGroup().addTo(trainMap);
}

/* -------------------------------- */
/* CENTRERA ALVESTA */
/* -------------------------------- */

function centerMapOnAlvesta() {
  if (!trainMap) {
    return;
  }

  trainMap.setView([56.899, 14.556], 8);
}

/* -------------------------------- */
/* HÄMTA TÅGPOSITIONER */
/* -------------------------------- */

async function loadTrainPositions() {
  const loading = document.querySelector("#mapLoading");

  if (loading) {
    loading.style.display = "block";
  }

  /*
        Kontrollera API-nyckeln.
    */

  if (!TRAFIKVERKET_API_KEY || TRAFIKVERKET_API_KEY === "DIN_API_NYCKEL_HÄR") {
    showApiKeyError();

    return;
  }

  /*
        Trafikverkets API tar emot
        XML men returnerar JSON.
    */

  const requestBody = `

        <REQUEST>

            <LOGIN
                authenticationkey="${TRAFIKVERKET_API_KEY}"
            />


            <QUERY
                objecttype="TrainPosition"
                schemaversion="1.1"
                limit="1000"
            >

                <FILTER>

                    <EQ
                        name="Status.Active"
                        value="true"
                    />

                </FILTER>

            </QUERY>

        </REQUEST>

    `;

  try {
    const response = await fetch(TRAFIKVERKET_URL, {
      method: "POST",

      headers: {
        "Content-Type": "text/xml",
      },

      body: requestBody,
    });

    if (!response.ok) {
      throw new Error("HTTP-fel: " + response.status);
    }

    const data = await response.json();

    /*
            Trafikverket kan returnera
            fel inne i JSON-svaret även
            om HTTP-anropet lyckades.
        */

    const result = data?.RESPONSE?.RESULT?.[0];

    if (!result) {
      throw new Error("API-svaret innehöll ingen data.");
    }

    if (result.ERROR) {
      console.error(result.ERROR);

      throw new Error("Trafikverket returnerade ett API-fel.");
    }

    const positions = result.TrainPosition || [];

    displayTrainPositions(positions);

    updateMapTime();

    if (loading) {
      loading.style.display = "none";
    }
  } catch (error) {
    console.error(error);

    showApiError(error.message);
  }
}

/* -------------------------------- */
/* VISA TÅGPOSITIONER */
/* -------------------------------- */

function displayTrainPositions(positions) {
  if (!trainMarkerLayer) {
    return;
  }

  trainMarkerLayer.clearLayers();

  for (const position of positions) {
    /*
            Filtrera bort
            inaktiva tåg.
        */

    if (position.Status && position.Status.Active === false) {
      continue;
    }

    const coordinates = parseWgs84(position?.Position?.WGS84);

    if (!coordinates) {
      continue;
    }

    const train = position.Train || {};

    const displayedNumber =
      train.AdvertisedTrainNumber || train.OperationalTrainNumber || "Tåg";

    const marker = createTrainMarker(
      coordinates.latitude,
      coordinates.longitude,
      displayedNumber,
    );

    marker.addTo(trainMarkerLayer);

    marker.on("click", function () {
      showSelectedTrain(position);
    });
  }
}

/* -------------------------------- */
/* SKAPA TÅGMARKÖR */
/* -------------------------------- */

function createTrainMarker(latitude, longitude, trainNumber) {
  const icon = L.divIcon({
    className: "",

    html: `
                    <div
                        class="train-marker"
                    >
                        ${trainNumber}
                    </div>
                    `,

    iconSize: [48, 38],

    iconAnchor: [24, 19],
  });

  return L.marker([latitude, longitude], {
    icon: icon,
  });
}

/* -------------------------------- */
/* PARSA WGS84 */
/* -------------------------------- */

/*
    Trafikverket skickar exempelvis:

    POINT (14.12345 57.98765)

    Första numret:
    longitude

    Andra numret:
    latitude
*/

function parseWgs84(value) {
  if (!value) {
    return null;
  }

  const match = value.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);

  if (!match) {
    return null;
  }

  const longitude = Number(match[1]);

  const latitude = Number(match[2]);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return {
    latitude: latitude,

    longitude: longitude,
  };
}

/* -------------------------------- */
/* VISA VALT TÅG */
/* -------------------------------- */

function showSelectedTrain(position) {
  const container = document.querySelector("#selectedTrain");

  if (!container) {
    return;
  }

  const train = position.Train || {};

  const trainNumber =
    train.AdvertisedTrainNumber || train.OperationalTrainNumber || "Okänt";

  const operationalNumber = train.OperationalTrainNumber || "Okänt";

  const speed =
    position.Speed !== undefined ? position.Speed + " km/h" : "Saknas";

  const bearing =
    position.Bearing !== undefined ? position.Bearing + "°" : "Saknas";

  const time = formatTrainTime(position.TimeStamp);

  container.className = "selected-train";

  container.innerHTML = `

        <h3>
            Tåg ${trainNumber}
        </h3>


        <div
            class="selected-train-info"
        >


            <div
                class="selected-train-row"
            >

                <span>
                    Tågnummer
                </span>

                <strong>
                    ${trainNumber}
                </strong>

            </div>


            <div
                class="selected-train-row"
            >

                <span>
                    Operativt tågnummer
                </span>

                <strong>
                    ${operationalNumber}
                </strong>

            </div>


            <div
                class="selected-train-row"
            >

                <span>
                    Hastighet
                </span>

                <strong>
                    ${speed}
                </strong>

            </div>


            <div
                class="selected-train-row"
            >

                <span>
                    Riktning
                </span>

                <strong>
                    ${bearing}
                </strong>

            </div>


            <div
                class="selected-train-row"
            >

                <span>
                    Position registrerad
                </span>

                <strong>
                    ${time}
                </strong>

            </div>


        </div>

    `;
}

/* -------------------------------- */
/* FORMATERA TID */
/* -------------------------------- */

function formatTrainTime(timestamp) {
  if (!timestamp) {
    return "Saknas";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString("sv-SE", {
    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });
}

/* -------------------------------- */
/* SENAST UPPDATERAD */
/* -------------------------------- */

function updateMapTime() {
  const element = document.querySelector("#mapUpdated");

  if (!element) {
    return;
  }

  const now = new Date();

  element.textContent = now.toLocaleTimeString("sv-SE", {
    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",
  });
}

/* -------------------------------- */
/* API KEY FEL */
/* -------------------------------- */

function showApiKeyError() {
  const loading = document.querySelector("#mapLoading");

  if (loading) {
    loading.style.display = "none";
  }

  const selectedTrain = document.querySelector("#selectedTrain");

  if (!selectedTrain) {
    return;
  }

  selectedTrain.className = "api-error";

  selectedTrain.innerHTML = `

        <strong>
            Trafikverket API-nyckel saknas.
        </strong>

        <div class="api-help">

            Öppna script.js och ersätt
            DIN_API_NYCKEL_HÄR
            med din Trafikverket API-nyckel.

        </div>

    `;
}

/* -------------------------------- */
/* API FEL */
/* -------------------------------- */

function showApiError(message) {
  const loading = document.querySelector("#mapLoading");

  if (loading) {
    loading.style.display = "none";
  }

  const selectedTrain = document.querySelector("#selectedTrain");

  if (!selectedTrain) {
    return;
  }

  selectedTrain.className = "api-error";

  selectedTrain.innerHTML = `

        <strong>
            Kunde inte hämta
            tågpositioner.
        </strong>


        <div class="api-help">

            ${message}

            <br><br>

            Kontrollera API-nyckeln
            och webbläsarens konsol.

        </div>

    `;
}

/* -------------------------------- */
/* STARTA APPEN */
/* -------------------------------- */

renderHome();

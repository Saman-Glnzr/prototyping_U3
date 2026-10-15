const app = document.querySelector("#app");

// Trafikverket API.
// Lägg in din riktiga nyckel senare.
// Utan nyckel används demodata.

const TRAFIKVERKET_API_KEY = "DIN_API_NYCKEL_HÄR";

const TRAFIKVERKET_URL = "https://api.trafikinfo.trafikverket.se/v2/data.json";

const TRAIN_REFRESH_MS = 30000;

let lang = "sv";

let view = "home";

let viewParam = null;

let stationSearch = "";

let stationSort = "az";

let map = null;

let markerLayer = null;

let refreshTimer = null;

let trains = [];

let trainSearch = "";

let trainSort = "number";

let selectedTrain = null;

let followTrain = false;

let dataMode = "demo";

const T = {
  sv: {
    app: "Reseskärmen",

    here: "Du är här:",

    language: "English",

    footer1: "High-Fidelity prototyp",

    footer2: "Publik pekskärm",

    homeTitle: "Se stationer och tåg live medan du väntar.",

    homeText:
      "Utforska andra stationer och perronger direkt från skärmen. Se hur det ser ut på en annan plats eller följ ett tåg på kartan och upptäck var det befinner sig just nu.",

    platforms: "Utforska perronger",

    platformsText:
      "Kika in på andra stationer och perronger. Välj en plats och öppna en live-vy för att se hur det ser ut där just nu.",

    platformsOpen: "Utforska live-vyer",

    trains: "Utforska tåg",

    trainsText:
      "Följ tåg på kartan och välj ett tåg för att se var det befinner sig. Öppna sedan tågets live-vy och följ resan.",

    trainsOpen: "Öppna livekartan",

    home: "Till startsidan",

    stationTitle: "Vilken perrong vill du kika på?",

    stationText:
      "Sök efter exempelvis Alvesta, Malmö eller Växjö och öppna en live-vy från stationen.",

    searchStation: "Sök station",

    searchStationPh: "Skriv exempelvis Växjö",

    sort: "Sortera",

    az: "A–Ö",

    za: "Ö–A",

    noStation: "Inga stationer matchade sökningen.",

    openPlatform: "Se perrongen live",

    simulated: "SIMULERAD LIVE-VY",

    platformInfo:
      "Titta in på perrongen och få en känsla av vad som händer på platsen utan att själv behöva vara där.",

    station: "Station",

    region: "Område",

    type: "Vy",

    platformArea: "Live perrongvy",

    another: "Utforska en annan perrong",

    trainTitle: "Följ tågen live",

    trainText:
      "Se tågens senaste position direkt på kartan. Tryck på ett tåg för att välja det och öppna dess live-vy.",

    loading: "Hämtar tågpositioner...",

    liveMap: "Live tågkarta",

    liveMapText:
      "Tryck på ett tåg och följ dess position. Du kan även öppna en live-vy för att uppleva tåget under resan.",

    updated: "Senast uppdaterad",

    searchTrain: "Sök tågnummer",

    searchTrainPh: "Exempel: 525",

    sortTrain: "Sortera tåg",

    sortNumber: "Tågnummer",

    sortSpeed: "Hastighet",

    mapTrains: "Tåg på kartan",

    noTrain: "Inga tåg matchar sökningen.",

    selectTrain: "Tryck på ett tåg på kartan eller i listan för att välja det.",

    trainNo: "Tågnummer",

    opNo: "Operativt tågnummer",

    follow: "Följ tåget på kartan",

    stopFollow: "Sluta följa",

    trainLive: "Se tåget live",

    closeTrainLive: "Stäng live-vy",

    trainLiveTitle: "Live från tåget",

    trainLiveText:
      "Här kan resenären följa tågets resa genom en live-vy och se omgivningen medan tåget rör sig.",

    trainLiveDemo: "SIMULERAD LIVE-VY FRÅN TÅGET",

    refresh: "Uppdatera karta",

    alvesta: "Visa Alvesta",

    liveData: "Trafikverket live-data",

    demo: "Demoläge",

    demoText:
      "API-nyckel saknas eller kunde inte användas. Kartan visar därför demodata tills nyckeln läggs in.",

    apiFail: "Trafikverkets data kunde inte hämtas. Demodata används istället.",
  },

  en: {
    app: "Travel Screen",

    here: "You are here:",

    language: "Svenska",

    footer1: "High-Fidelity prototype",

    footer2: "Public touch screen",

    homeTitle: "Watch stations and trains live while you wait.",

    homeText:
      "Explore other stations and platforms directly from the screen. See what another location looks like or follow a train on the map and discover where it is right now.",

    platforms: "Explore platforms",

    platformsText:
      "Take a look at other stations and platforms. Choose a location and open a live view to see what it looks like there.",

    platformsOpen: "Explore live views",

    trains: "Explore trains",

    trainsText:
      "Follow trains on the map and select one to see where it is. You can then open its live view and follow the journey.",

    trainsOpen: "Open live map",

    home: "Go to start page",

    stationTitle: "Which platform would you like to see?",

    stationText:
      "Search for Alvesta, Malmö or Växjö and open a live view from the station.",

    searchStation: "Search station",

    searchStationPh: "For example Växjö",

    sort: "Sort",

    az: "A–Z",

    za: "Z–A",

    noStation: "No stations matched the search.",

    openPlatform: "View platform live",

    simulated: "SIMULATED LIVE VIEW",

    platformInfo:
      "Look into the platform and get a sense of what is happening there without actually being at the location.",

    station: "Station",

    region: "Area",

    type: "View",

    platformArea: "Live platform view",

    another: "Explore another platform",

    trainTitle: "Follow trains live",

    trainText:
      "See the latest train positions directly on the map. Tap a train to select it and open its live view.",

    loading: "Loading train positions...",

    liveMap: "Live train map",

    liveMapText:
      "Tap a train and follow its position. You can also open a live view and experience the train during its journey.",

    updated: "Last updated",

    searchTrain: "Search train number",

    searchTrainPh: "Example: 525",

    sortTrain: "Sort trains",

    sortNumber: "Train number",

    sortSpeed: "Speed",

    mapTrains: "Trains on map",

    noTrain: "No trains match the search.",

    selectTrain: "Tap a train on the map or in the list to select it.",

    trainNo: "Train number",

    opNo: "Operational train number",

    follow: "Follow train on map",

    stopFollow: "Stop following",

    trainLive: "Watch train live",

    closeTrainLive: "Close live view",

    trainLiveTitle: "Live from the train",

    trainLiveText:
      "Here the passenger can follow the journey through a live view and see the surroundings as the train moves.",

    trainLiveDemo: "SIMULATED LIVE VIEW FROM TRAIN",

    refresh: "Refresh map",

    alvesta: "Show Alvesta",

    liveData: "Trafikverket live data",

    demo: "Demo mode",

    demoText:
      "The API key is missing or could not be used. Demo data is shown until the key is added.",

    apiFail:
      "Trafikverket data could not be loaded. Demo data is used instead.",
  },
};

function t(key) {
  return T[lang][key] || key;
}

function locale() {
  if (lang === "sv") {
    return "sv-SE";
  }

  return "en-GB";
}

const stations = [
  {
    id: "alvesta",
    name: "Alvesta station",
    city: "Alvesta",
    region: "Småland",
  },

  {
    id: "emmaboda",
    name: "Emmaboda station",
    city: "Emmaboda",
    region: "Småland",
  },

  {
    id: "kalmar",
    name: "Kalmar Centralstation",
    city: "Kalmar",
    region: "Småland",
  },

  {
    id: "malmo",
    name: "Malmö Centralstation",
    city: "Malmö",
    region: "Skåne",
  },

  {
    id: "nassjo",
    name: "Nässjö Centralstation",
    city: "Nässjö",
    region: "Småland",
  },

  {
    id: "varnamo",
    name: "Värnamo station",
    city: "Värnamo",
    region: "Småland",
  },

  {
    id: "vaxjo",
    name: "Växjö station",
    city: "Växjö",
    region: "Småland",
  },

  {
    id: "almhult",
    name: "Älmhult station",
    city: "Älmhult",
    region: "Småland",
  },
];

const demoTrains = [
  ["1038", 14.57, 56.91, 72, 25],

  ["525", 14.81, 56.995, 118, 52],

  ["1764", 14.95, 56.88, 91, 255],

  ["1091", 13.93, 56.62, 104, 18],

  ["542", 14.77, 57.17, 84, 340],
].map(function (train) {
  return {
    Train: {
      AdvertisedTrainNumber: train[0],

      OperationalTrainNumber: train[0],
    },

    Position: {
      WGS84: `POINT (${train[1]} ${train[2]})`,
    },

    Speed: train[3],

    Bearing: train[4],

    TimeStamp: new Date().toISOString(),

    Status: {
      Active: true,
    },
  };
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}

function updateChrome() {
  document.querySelector("#appName").textContent = t("app");

  document.querySelector("#youAreHere").textContent = t("here");

  document.querySelector("#languageButton").textContent = t("language");

  document.querySelector("#footerPrototype").textContent = t("footer1");

  document.querySelector("#footerScreen").textContent = t("footer2");

  document.documentElement.lang = lang;

  updateClock();
}

function updateClock() {
  const now = new Date();

  document.querySelector("#clock").textContent = now.toLocaleTimeString(
    locale(),

    {
      hour: "2-digit",

      minute: "2-digit",
    },
  );

  document.querySelector("#date").textContent = now.toLocaleDateString(
    locale(),

    {
      weekday: "long",

      day: "numeric",

      month: "long",
    },
  );
}

setInterval(updateClock, 1000);

function setView(newView, parameter = null) {
  if (view === "trains" && newView !== "trains") {
    destroyMap();
  }

  view = newView;

  viewParam = parameter;

  render();

  window.scrollTo({
    top: 0,
    behavior: "auto",
  });
}

function render() {
  if (view === "home") {
    renderHome();

    return;
  }

  if (view === "platforms") {
    renderPlatforms();

    return;
  }

  if (view === "platformDetail") {
    renderPlatform(viewParam);

    return;
  }

  if (view === "trains") {
    renderTrains();
  }
}

function heading(title, description) {
  return `

        <section class="page-heading">

            <button
                class="nav-button"
                id="homeButton"
                type="button"
            >

                ${t("home")}

            </button>


            <div>

                <h1>
                    ${title}
                </h1>

                <p>
                    ${description}
                </p>

            </div>

        </section>

    `;
}

function bindHome() {
  const button = document.querySelector("#homeButton");

  if (!button) {
    return;
  }

  button.addEventListener("click", function () {
    setView("home");
  });
}

function renderHome() {
  app.innerHTML = `

        <section class="hero-simple">

            <h1>
                ${t("homeTitle")}
            </h1>

            <p>
                ${t("homeText")}
            </p>

        </section>


        <section class="action-grid two-actions">


            <button
                class="action-card"
                id="platformButton"
                type="button"
            >

                <h2>
                    ${t("platforms")}
                </h2>

                <p>
                    ${t("platformsText")}
                </p>

                <span class="link-label">
                    ${t("platformsOpen")}
                </span>

            </button>


            <button
                class="action-card"
                id="trainButton"
                type="button"
            >

                <h2>
                    ${t("trains")}
                </h2>

                <p>
                    ${t("trainsText")}
                </p>

                <span class="link-label">
                    ${t("trainsOpen")}
                </span>

            </button>


        </section>

    `;

  document
    .querySelector("#platformButton")
    .addEventListener("click", function () {
      setView("platforms");
    });

  document.querySelector("#trainButton").addEventListener("click", function () {
    setView("trains");
  });
}

function renderPlatforms() {
  app.innerHTML = `

        ${heading(t("stationTitle"), t("stationText"))}


        <section class="toolbar">


            <div class="field-group">

                <label for="stationSearch">

                    ${t("searchStation")}

                </label>


                <input
                    id="stationSearch"
                    type="search"
                    value="${escapeHtml(stationSearch)}"
                    placeholder="${t("searchStationPh")}"
                >

            </div>


            <div class="field-group">

                <label for="stationSort">

                    ${t("sort")}

                </label>


                <select id="stationSort">

                    <option
                        value="az"
                        ${stationSort === "az" ? "selected" : ""}
                    >

                        ${t("az")}

                    </option>


                    <option
                        value="za"
                        ${stationSort === "za" ? "selected" : ""}
                    >

                        ${t("za")}

                    </option>

                </select>

            </div>


        </section>


        <section
            id="stationGrid"
            class="choice-grid"
        >
        </section>

    `;

  bindHome();

  document
    .querySelector("#stationSearch")
    .addEventListener("input", function (event) {
      stationSearch = event.target.value;

      renderStationCards();
    });

  document
    .querySelector("#stationSort")
    .addEventListener("change", function (event) {
      stationSort = event.target.value;

      renderStationCards();
    });

  renderStationCards();
}

function renderStationCards() {
  const grid = document.querySelector("#stationGrid");

  const query = stationSearch.trim().toLocaleLowerCase("sv-SE");

  let list = stations.filter(function (station) {
    const text = `
                    ${station.name}
                    ${station.city}
                    ${station.region}
                    `.toLocaleLowerCase("sv-SE");

    return text.includes(query);
  });

  list.sort(function (a, b) {
    const result = a.name.localeCompare(b.name, "sv-SE");

    if (stationSort === "az") {
      return result;
    }

    return -result;
  });

  if (list.length === 0) {
    grid.innerHTML = `

            <div class="empty-state">

                ${t("noStation")}

            </div>

        `;

    return;
  }

  grid.innerHTML = list
    .map(function (station) {
      let description;

      if (lang === "sv") {
        description = `Kika in på ${station.name} och se hur perrongområdet kan upplevas live.`;
      } else {
        description = `Take a live look at the platform area at ${station.name}.`;
      }

      return `

                    <button
                        class="choice-card"
                        type="button"
                        data-station="${station.id}"
                    >


                        <span class="location-label">

                            ${station.region}

                        </span>


                        <h2>

                            ${station.name}

                        </h2>


                        <p>

                            ${description}

                        </p>


                        <span class="link-label">

                            ${t("openPlatform")}

                        </span>


                    </button>

                `;
    })
    .join("");

  const buttons = grid.querySelectorAll("[data-station]");

  for (const button of buttons) {
    button.addEventListener("click", function () {
      setView("platformDetail", button.dataset.station);
    });
  }
}

function renderPlatform(id) {
  const station = stations.find(function (item) {
    return item.id === id;
  });

  if (!station) {
    setView("platforms");

    return;
  }

  let description;

  if (lang === "sv") {
    description = `Du tittar just nu på ${station.name}. Se hur platsen ser ut och vad som händer på perrongen.`;
  } else {
    description = `You are currently viewing ${station.name}. See what the location looks like and what is happening on the platform.`;
  }

  app.innerHTML = `

        ${heading(station.name, description)}


        <section class="detail-card">


            <div class="live-view">

                <span class="live-badge">

                    ${t("simulated")}

                </span>


                <div class="platform-sign">

                    ${station.name}

                </div>

            </div>


            <div class="detail-body">

                <h2>
                    ${station.name}
                </h2>

                <p>
                    ${t("platformInfo")}
                </p>


                <div class="info-grid">


                    <div class="info-box">

                        <span>
                            ${t("station")}
                        </span>

                        <strong>
                            ${station.city}
                        </strong>

                    </div>


                    <div class="info-box">

                        <span>
                            ${t("region")}
                        </span>

                        <strong>
                            ${station.region}
                        </strong>

                    </div>


                    <div class="info-box">

                        <span>
                            ${t("type")}
                        </span>

                        <strong>
                            ${t("platformArea")}
                        </strong>

                    </div>


                </div>


                <div class="button-row">


                    <button
                        class="primary-button"
                        id="platformHome"
                        type="button"
                    >

                        ${t("home")}

                    </button>


                    <button
                        class="secondary-button"
                        id="platformBack"
                        type="button"
                    >

                        ${t("another")}

                    </button>


                </div>


            </div>


        </section>

    `;

  bindHome();

  document
    .querySelector("#platformHome")
    .addEventListener("click", function () {
      setView("home");
    });

  document
    .querySelector("#platformBack")
    .addEventListener("click", function () {
      setView("platforms");
    });
}

function renderTrains() {
  app.innerHTML = `

        ${heading(t("trainTitle"), t("trainText"))}


        <section class="train-map-layout">


            <div class="map-panel">

                <div
                    id="mapBadge"
                    class="map-badge"
                >

                    ${t("loading")}

                </div>


                <div id="trainMap">
                </div>

            </div>


            <aside class="map-side-panel">


                <h2>
                    ${t("liveMap")}
                </h2>

                <p>
                    ${t("liveMapText")}
                </p>


                <div class="map-status">

                    <span>
                        ${t("updated")}
                    </span>

                    <strong id="mapUpdated">
                        --:--:--
                    </strong>

                </div>


                <div class="train-controls">


                    <div class="field-group">

                        <label for="trainSearch">

                            ${t("searchTrain")}

                        </label>


                        <input
                            id="trainSearch"
                            type="search"
                            value="${escapeHtml(trainSearch)}"
                            placeholder="${t("searchTrainPh")}"
                        >

                    </div>


                    <div class="field-group">

                        <label for="trainSort">

                            ${t("sortTrain")}

                        </label>


                        <select id="trainSort">


                            <option
                                value="number"
                                ${trainSort === "number" ? "selected" : ""}
                            >

                                ${t("sortNumber")}

                            </option>


                            <option
                                value="speed"
                                ${trainSort === "speed" ? "selected" : ""}
                            >

                                ${t("sortSpeed")}

                            </option>


                        </select>

                    </div>


                </div>


                <div id="sourceNote">
                </div>


                <div
                    id="selectedTrain"
                    class="train-info-empty"
                >

                    ${t("selectTrain")}

                </div>


                <div class="button-row">


                    <button
                        class="secondary-button"
                        id="refreshButton"
                        type="button"
                    >

                        ${t("refresh")}

                    </button>


                    <button
                        class="secondary-button"
                        id="centerButton"
                        type="button"
                    >

                        ${t("alvesta")}

                    </button>


                </div>


                <h3>
                    ${t("mapTrains")}
                </h3>


                <div
                    id="trainList"
                    class="train-list-small"
                >
                </div>


            </aside>


        </section>

    `;

  bindHome();

  createMap();

  loadTrains();

  document
    .querySelector("#trainSearch")
    .addEventListener("input", function (event) {
      trainSearch = event.target.value;

      renderTrainData();
    });

  document
    .querySelector("#trainSort")
    .addEventListener("change", function (event) {
      trainSort = event.target.value;

      renderTrainData();
    });

  document
    .querySelector("#refreshButton")
    .addEventListener("click", loadTrains);

  document
    .querySelector("#centerButton")
    .addEventListener("click", function () {
      followTrain = false;

      map.setView([56.899, 14.556], 8);

      if (selectedTrain) {
        showTrain(selectedTrain);
      }
    });

  refreshTimer = setInterval(loadTrains, TRAIN_REFRESH_MS);
}

function createMap() {
  map = L.map("trainMap", {
    zoomControl: true,

    tap: true,
  }).setView([56.899, 14.556], 7);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {
      maxZoom: 19,

      attribution: "&copy; OpenStreetMap",
    },
  ).addTo(map);

  L.circleMarker(
    [56.899, 14.556],

    {
      radius: 9,

      weight: 4,

      color: "#174f7c",

      fillColor: "#ffffff",

      fillOpacity: 1,
    },
  )
    .addTo(map)
    .bindPopup("<strong>Alvesta station</strong>");

  markerLayer = L.layerGroup().addTo(map);
}

function destroyMap() {
  if (refreshTimer) {
    clearInterval(refreshTimer);

    refreshTimer = null;
  }

  if (map) {
    map.remove();

    map = null;
  }

  markerLayer = null;
}

function hasKey() {
  return TRAFIKVERKET_API_KEY && TRAFIKVERKET_API_KEY !== "DIN_API_NYCKEL_HÄR";
}

async function loadTrains() {
  const badge = document.querySelector("#mapBadge");

  if (badge) {
    badge.textContent = t("loading");
  }

  if (!hasKey()) {
    useDemo(false);

    return;
  }

  const body = `

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
    const response = await fetch(
      TRAFIKVERKET_URL,

      {
        method: "POST",

        headers: {
          "Content-Type": "text/xml",
        },

        body: body,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    const result = json?.RESPONSE?.RESULT?.[0];

    if (
      !result ||
      result.ERROR ||
      !Array.isArray(result.TrainPosition) ||
      result.TrainPosition.length === 0
    ) {
      throw new Error("No train data");
    }

    trains = result.TrainPosition;

    dataMode = "live";

    updateSource(false);

    renderTrainData();

    updateMapTime();

    refreshSelected();
  } catch (error) {
    console.error(error);

    useDemo(true);
  }
}

function useDemo(failed) {
  trains = demoTrains.map(function (train) {
    return {
      ...train,

      TimeStamp: new Date().toISOString(),
    };
  });

  dataMode = "demo";

  updateSource(failed);

  renderTrainData();

  updateMapTime();

  refreshSelected();
}

function updateSource(failed) {
  const note = document.querySelector("#sourceNote");

  const badge = document.querySelector("#mapBadge");

  if (!note || !badge) {
    return;
  }

  if (dataMode === "live") {
    note.innerHTML = `

            <div class="api-note">

                <strong>
                    ${t("liveData")}
                </strong>

            </div>

        `;

    badge.textContent = t("liveData");

    return;
  }

  note.innerHTML = `

        <div
            class="${failed ? "api-error" : "api-note"}"
        >

            <strong>

                ${failed ? t("apiFail") : t("demo")}

            </strong>

            <br>

            ${t("demoText")}

        </div>

    `;

  badge.textContent = t("demo");
}

function trainNo(train) {
  return String(
    train?.Train?.AdvertisedTrainNumber ||
      train?.Train?.OperationalTrainNumber ||
      "?",
  );
}

function trainSpeed(train) {
  const number = Number(train?.Speed);

  if (Number.isFinite(number)) {
    return Math.round(number);
  }

  return 0;
}

function coords(value) {
  const match = String(value || "").match(
    /POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i,
  );

  if (!match) {
    return null;
  }

  const longitude = Number(match[1]);

  const latitude = Number(match[2]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    lat: latitude,

    lon: longitude,
  };
}

function renderTrainData() {
  if (!markerLayer) {
    return;
  }

  markerLayer.clearLayers();

  const query = trainSearch.trim().toLowerCase();

  let list = trains.filter(function (train) {
    return trainNo(train).toLowerCase().includes(query);
  });

  list.sort(function (a, b) {
    if (trainSort === "speed") {
      return trainSpeed(b) - trainSpeed(a);
    }

    return trainNo(a).localeCompare(
      trainNo(b),

      undefined,

      {
        numeric: true,
      },
    );
  });

  for (const train of list) {
    const position = coords(train?.Position?.WGS84);

    if (!position) {
      continue;
    }

    const icon = L.divIcon({
      className: "",

      html: `

                        <div class="train-marker">

                            ${escapeHtml(trainNo(train))}

                        </div>

                    `,

      iconSize: [52, 40],

      iconAnchor: [26, 20],
    });

    const marker = L.marker(
      [position.lat, position.lon],

      {
        icon: icon,
      },
    ).addTo(markerLayer);

    marker.on("click", function () {
      selectTrain(train, true);
    });
  }

  const listContainer = document.querySelector("#trainList");

  if (list.length === 0) {
    listContainer.innerHTML = `

            <div class="empty-state">

                ${t("noTrain")}

            </div>

        `;

    return;
  }

  listContainer.innerHTML = list
    .slice(0, 20)
    .map(function (train) {
      return `

                    <button
                        class="train-list-button"
                        type="button"
                        data-id="${escapeHtml(trainNo(train))}"
                    >

                        <span>

                            <strong>

                                ${t("trainNo")}
                                ${escapeHtml(trainNo(train))}

                            </strong>

                        </span>


                    </button>

                `;
    })
    .join("");

  const buttons = listContainer.querySelectorAll("[data-id]");

  for (const button of buttons) {
    button.addEventListener("click", function () {
      const train = list.find(function (item) {
        return trainNo(item) === button.dataset.id;
      });

      if (train) {
        selectTrain(train, true);
      }
    });
  }
}

function selectTrain(train, center) {
  selectedTrain = train;

  showTrain(train);

  const position = coords(train?.Position?.WGS84);

  if (center && position && map) {
    map.setView(
      [position.lat, position.lon],

      Math.max(map.getZoom(), 9),
    );
  }
}

function showTrain(train) {
  const container = document.querySelector("#selectedTrain");

  if (!container) {
    return;
  }

  container.className = "selected-train";

  container.innerHTML = `

        <h3>

            ${t("trainNo")}
            ${escapeHtml(trainNo(train))}

        </h3>


        <div class="selected-train-info">


            <div class="selected-train-row">

                <span>
                    ${t("trainNo")}
                </span>

                <strong>

                    ${escapeHtml(trainNo(train))}

                </strong>

            </div>


            <div class="selected-train-row">

                <span>
                    ${t("opNo")}
                </span>

                <strong>

                    ${escapeHtml(train?.Train?.OperationalTrainNumber || "–")}

                </strong>

            </div>


        </div>


        <div class="button-row">


            <button
                class="primary-button"
                id="trainLiveButton"
                type="button"
            >

                ${t("trainLive")}

            </button>


            <button
                class="secondary-button"
                id="followButton"
                type="button"
            >

                ${followTrain ? t("stopFollow") : t("follow")}

            </button>


            <button
                class="secondary-button"
                id="trainHome"
                type="button"
            >

                ${t("home")}

            </button>


        </div>


        <div
            id="trainLiveView"
            class="train-live-view hidden"
        >

            <div class="train-live-screen">

                <span class="live-badge">

                    ${t("trainLiveDemo")}

                </span>


                <div class="train-window-scene">

                    <div class="train-horizon">
                    </div>

                    <div class="train-landscape">
                    </div>

                    <div class="train-track">
                    </div>

                </div>

            </div>


            <div class="train-live-copy">

                <h3>
                    ${t("trainLiveTitle")}
                </h3>

                <p>
                    ${t("trainLiveText")}
                </p>

            </div>

        </div>

    `;

  const liveButton = document.querySelector("#trainLiveButton");

  liveButton.addEventListener("click", function () {
    const liveView = document.querySelector("#trainLiveView");

    const isHidden = liveView.classList.contains("hidden");

    if (isHidden) {
      liveView.classList.remove("hidden");

      liveButton.textContent = t("closeTrainLive");
    } else {
      liveView.classList.add("hidden");

      liveButton.textContent = t("trainLive");
    }
  });

  document
    .querySelector("#followButton")
    .addEventListener("click", function () {
      followTrain = !followTrain;

      showTrain(train);

      if (followTrain) {
        selectTrain(train, true);
      }
    });

  document.querySelector("#trainHome").addEventListener("click", function () {
    setView("home");
  });
}

function refreshSelected() {
  if (!selectedTrain) {
    return;
  }

  const current = trains.find(function (train) {
    return trainNo(train) === trainNo(selectedTrain);
  });

  if (!current) {
    return;
  }

  selectedTrain = current;

  showTrain(current);

  if (followTrain) {
    const position = coords(current?.Position?.WGS84);

    if (position && map) {
      map.setView(
        [position.lat, position.lon],

        Math.max(map.getZoom(), 9),
      );
    }
  }
}

function updateMapTime() {
  const element = document.querySelector("#mapUpdated");

  if (!element) {
    return;
  }

  element.textContent = new Date().toLocaleTimeString(
    locale(),

    {
      hour: "2-digit",

      minute: "2-digit",

      second: "2-digit",
    },
  );
}

document
  .querySelector("#languageButton")
  .addEventListener("click", function () {
    if (view === "trains") {
      destroyMap();
    }

    if (lang === "sv") {
      lang = "en";
    } else {
      lang = "sv";
    }

    updateChrome();

    render();
  });

updateChrome();

renderHome();

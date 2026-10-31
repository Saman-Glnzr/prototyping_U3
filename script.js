const app = document.getElementById("app");

const questionBank = {
  Historia: [
    {
      question: "Vilket år började andra världskriget?",
      answers: ["1914", "1939", "1945", "1950"],
      correct: 1,
    },

    {
      question: "Vilken civilisation byggde Colosseum?",
      answers: ["Romarriket", "Vikingarna", "Maya", "Egyptierna"],
      correct: 0,
    },

    {
      question: "Vem var Sveriges första kvinnliga statsminister?",
      answers: [
        "Anna Lindh",
        "Magdalena Andersson",
        "Mona Sahlin",
        "Annie Lööf",
      ],
      correct: 1,
    },

    {
      question: "Vilket år föll Berlinmuren?",
      answers: ["1975", "1989", "1995", "2001"],
      correct: 1,
    },

    {
      question: "Vilket land förknippas med faraoner?",
      answers: ["Italien", "Egypten", "Grekland", "Spanien"],
      correct: 1,
    },
  ],

  Resor: [
    {
      question: "Vilken stad är Frankrikes huvudstad?",
      answers: ["Lyon", "Paris", "Nice", "Bordeaux"],
      correct: 1,
    },

    {
      question: "Vilket land ligger Tokyo i?",
      answers: ["Kina", "Japan", "Sydkorea", "Thailand"],
      correct: 1,
    },

    {
      question: "Vilken stad är känd för Colosseum?",
      answers: ["Rom", "Madrid", "Berlin", "Oslo"],
      correct: 0,
    },

    {
      question: "Vilket land ligger Barcelona i?",
      answers: ["Portugal", "Spanien", "Frankrike", "Italien"],
      correct: 1,
    },

    {
      question: "På vilken kontinent ligger Kenya?",
      answers: ["Europa", "Asien", "Afrika", "Sydamerika"],
      correct: 2,
    },
  ],

  Politik: [
    {
      question: "Hur ofta hålls ordinarie riksdagsval i Sverige?",
      answers: [
        "Vartannat år",
        "Vart tredje år",
        "Vart fjärde år",
        "Vart femte år",
      ],
      correct: 2,
    },

    {
      question: "Vad heter Sveriges nationella parlament?",
      answers: ["Riksdagen", "Senaten", "Kongressen", "Landstinget"],
      correct: 0,
    },

    {
      question: "Hur många ledamöter har Sveriges riksdag?",
      answers: ["249", "299", "349", "399"],
      correct: 2,
    },

    {
      question: "Vilken nivå fattar beslut om många lokala frågor?",
      answers: ["Kommunen", "FN", "EU-domstolen", "NATO"],
      correct: 0,
    },

    {
      question: "Vilket av dessa är ett politiskt val i Sverige?",
      answers: ["Riksdagsval", "Körkortsval", "Bankval", "Skolprov"],
      correct: 0,
    },
  ],

  Sverige: [
    {
      question: "Vilken stad är Sveriges huvudstad?",
      answers: ["Göteborg", "Malmö", "Stockholm", "Uppsala"],
      correct: 2,
    },

    {
      question: "Vilket landskap ligger Växjö i?",
      answers: ["Småland", "Skåne", "Dalarna", "Halland"],
      correct: 0,
    },

    {
      question: "Vilken sjö är Sveriges största?",
      answers: ["Vättern", "Mälaren", "Vänern", "Hjälmaren"],
      correct: 2,
    },

    {
      question: "Vilket av dessa är ett svenskt län?",
      answers: [
        "Kronobergs län",
        "Oslo län",
        "Köpenhamns län",
        "Helsingfors län",
      ],
      correct: 0,
    },

    {
      question: "Vilken färg finns i Sveriges flagga tillsammans med blått?",
      answers: ["Röd", "Gul", "Grön", "Vit"],
      correct: 1,
    },
  ],
};

let currentQuestions = [];

let currentCategory = "";

let currentIndex = 0;

let score = 0;

let answered = false;

/* REKORDLÄGE */

let recordMode = false;

let recordStreak = 0;

let recordQuestion = null;

/*
  Rekordet börjar på 100.

  Om någon slår 100 sparas det nya rekordet
  i webbläsaren.
*/

let globalRecord = Number(localStorage.getItem("quizRecord")) || 100;

/* PERSONLIGA BÄSTA RESULTAT */

let bestScores = JSON.parse(localStorage.getItem("quizBestScores")) || {};

/* STARTSIDA */

function renderHome() {
  recordMode = false;

  app.innerHTML = `

    <section class="screen">

      <h1>
        QUIZ
      </h1>

      <p class="lead">
        Välj en kategori och spela ett snabbt quiz.
        En vanlig omgång tar ungefär 1–2 minuter.
      </p>


      <div class="category-grid">


        ${Object.keys(questionBank)
          .map((category) => {
            const best =
              bestScores[category] !== undefined
                ? `${bestScores[category]}/5`
                : "Inget resultat ännu";

            return `

            <button
              class="big-button"
              data-category="${category}"
            >

              ${category}

              <span>
                5 frågor · Bäst: ${best}
              </span>

            </button>

          `;
          })
          .join("")}


        <button
          class="big-button mix"
          data-category="Slumpmix"
        >

          Slumpmix

          <span>
            Frågor från flera kategorier
          </span>

        </button>


        <button
          class="big-button record"
          id="recordMode"
        >

          Rekordläge

          <span>
            Rekord: ${globalRecord} rätt i rad
          </span>

        </button>


      </div>


      <p class="small-note">
        Du kan avsluta quizet när som helst.
      </p>


    </section>

  `;

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      startQuiz(button.dataset.category);
    });
  });

  document
    .getElementById("recordMode")
    .addEventListener("click", startRecordMode);
}

/* STARTA VANLIGT QUIZ */

function startQuiz(category) {
  recordMode = false;

  currentCategory = category;

  currentIndex = 0;

  score = 0;

  answered = false;

  if (category === "Slumpmix") {
    const allQuestions = Object.values(questionBank).flat();

    currentQuestions = shuffle([...allQuestions]).slice(0, 5);
  } else {
    currentQuestions = shuffle([...questionBank[category]]);
  }

  renderQuestion();
}

/* VISA FRÅGA */

function renderQuestion() {
  const item = currentQuestions[currentIndex];

  const progress = ((currentIndex + 1) / currentQuestions.length) * 100;

  app.innerHTML = `

    <section class="screen">


      <div class="quiz-top">

        <div>

          <p class="eyebrow">
            ${currentCategory}
          </p>

          <div class="progress-copy">

            Fråga
            ${currentIndex + 1}
            av
            ${currentQuestions.length}

          </div>

        </div>


        <button
          class="exit-button"
          id="exitQuiz"
        >
          Avsluta quiz
        </button>

      </div>


      <div class="progress-track">

        <div
          class="progress-bar"
          style="width:${progress}%"
        >
        </div>

      </div>


      <h2 class="question">
        ${item.question}
      </h2>


      <div class="answer-grid">

        ${item.answers
          .map(
            (answer, index) => `

          <button
            class="answer-button"
            data-answer="${index}"
          >

            ${answer}

          </button>

        `,
          )
          .join("")}

      </div>


      <div id="feedback"></div>


    </section>

  `;

  document.getElementById("exitQuiz").addEventListener("click", renderHome);

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      chooseAnswer(Number(button.dataset.answer));
    });
  });
}

/* VÄLJ SVAR */

function chooseAnswer(selectedIndex) {
  if (answered) {
    return;
  }

  answered = true;

  const item = currentQuestions[currentIndex];

  const buttons = [...document.querySelectorAll("[data-answer]")];

  const feedback = document.getElementById("feedback");

  const isCorrect = selectedIndex === item.correct;

  if (isCorrect) {
    score++;
  }

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === item.correct) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && !isCorrect) {
      button.classList.add("wrong");
    }
  });

  feedback.innerHTML = `

    <div
      class="feedback-box
      ${isCorrect ? "correct" : "wrong"}"
    >

      ${
        isCorrect ? "Rätt!" : `Fel! Rätt svar är ${item.answers[item.correct]}.`
      }

    </div>


    <div class="actions">

      <button
        class="next-button"
        id="nextQuestion"
      >

        ${
          currentIndex === currentQuestions.length - 1
            ? "Visa resultat"
            : "Nästa fråga"
        }

      </button>

    </div>

  `;

  document.getElementById("nextQuestion").addEventListener("click", () => {
    currentIndex++;

    answered = false;

    if (currentIndex >= currentQuestions.length) {
      renderResult();
    } else {
      renderQuestion();
    }
  });
}

/* RESULTAT */

function renderResult() {
  const total = currentQuestions.length;

  const percentage = Math.round((score / total) * 100);

  /*
    Spara personligt bästa resultat
    om det är en vanlig kategori.
  */

  if (currentCategory !== "Slumpmix") {
    const oldBest = bestScores[currentCategory] || 0;

    if (score > oldBest) {
      bestScores[currentCategory] = score;

      localStorage.setItem("quizBestScores", JSON.stringify(bestScores));
    }
  }

  let bestText = "";

  if (currentCategory !== "Slumpmix") {
    bestText = `

      <div class="best-score">

        Bästa resultat i
        ${currentCategory}:
        <strong>
          ${bestScores[currentCategory]}/5
        </strong>

      </div>

    `;
  }

  app.innerHTML = `

    <section class="screen">


      <p class="eyebrow">
        Quiz klart
      </p>


      <h2>
        Resultat
      </h2>


      <div class="result-score">

        ${score}/${total}

      </div>


      <div class="result-percent">

        ${percentage} %

      </div>


      <p class="result-text">

        Du fick
        ${score}
        av
        ${total}
        frågor rätt.

      </p>


      ${bestText}


      <div class="actions">


        <button
          class="next-button"
          id="playAgain"
        >

          Spela igen

        </button>


        <button
          class="secondary-button"
          id="randomQuiz"
        >

          Nytt slumpquiz

        </button>


        <button
          class="secondary-button"
          id="homeButton"
        >

          Välj kategori

        </button>


      </div>


    </section>

  `;

  document.getElementById("playAgain").addEventListener("click", () => {
    startQuiz(currentCategory);
  });

  document.getElementById("randomQuiz").addEventListener("click", () => {
    startQuiz("Slumpmix");
  });

  document.getElementById("homeButton").addEventListener("click", renderHome);
}

/* STARTA REKORDLÄGE */

function startRecordMode() {
  recordMode = true;

  recordStreak = 0;

  answered = false;

  renderRecordQuestion();
}

/* HÄMTA SLUMPAD FRÅGA */

function getRandomQuestion() {
  const allQuestions = Object.values(questionBank).flat();

  const randomIndex = Math.floor(Math.random() * allQuestions.length);

  return allQuestions[randomIndex];
}

/* VISA REKORDFRÅGA */

function renderRecordQuestion() {
  recordQuestion = getRandomQuestion();

  answered = false;

  app.innerHTML = `

    <section class="screen">


      <div class="quiz-top">

        <div>

          <p class="eyebrow">
            Rekordläge
          </p>

          <div class="progress-copy">

            Rätt i rad:
            ${recordStreak}

          </div>

        </div>


        <button
          class="exit-button"
          id="exitRecord"
        >

          Avsluta

        </button>

      </div>


      <div class="record-box">

        Nuvarande rekord

        <div class="record-number">

          ${globalRecord}

        </div>

        rätt i rad

      </div>


      <h2 class="question">

        ${recordQuestion.question}

      </h2>


      <div class="answer-grid">

        ${recordQuestion.answers
          .map(
            (answer, index) => `

            <button
              class="answer-button"
              data-record-answer="${index}"
            >

              ${answer}

            </button>

          `,
          )
          .join("")}

      </div>


      <div id="feedback"></div>


    </section>

  `;

  document.getElementById("exitRecord").addEventListener("click", renderHome);

  document.querySelectorAll("[data-record-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      chooseRecordAnswer(Number(button.dataset.recordAnswer));
    });
  });
}

/* SVAR I REKORDLÄGE */

function chooseRecordAnswer(selectedIndex) {
  if (answered) {
    return;
  }

  answered = true;

  const isCorrect = selectedIndex === recordQuestion.correct;

  const buttons = [...document.querySelectorAll("[data-record-answer]")];

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === recordQuestion.correct) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && !isCorrect) {
      button.classList.add("wrong");
    }
  });

  const feedback = document.getElementById("feedback");

  /* RÄTT SVAR */

  if (isCorrect) {
    recordStreak++;

    let recordMessage = "";

    if (recordStreak > globalRecord) {
      globalRecord = recordStreak;

      localStorage.setItem("quizRecord", globalRecord);

      recordMessage = `
        Du har slagit rekordet!
      `;
    }

    feedback.innerHTML = `

      <div class="feedback-box correct">

        Rätt!

        ${recordMessage}

      </div>


      <div class="actions">

        <button
          class="next-button"
          id="nextRecord"
        >

          Nästa fråga

        </button>

      </div>

    `;

    document
      .getElementById("nextRecord")
      .addEventListener("click", renderRecordQuestion);
  } else {
    /* FEL SVAR */
    feedback.innerHTML = `

      <div class="feedback-box wrong">

        Fel!

        Rätt svar var
        ${recordQuestion.answers[recordQuestion.correct]}.

      </div>


      <div class="record-box">

        Du fick

        <div class="record-number">

          ${recordStreak}

        </div>

        rätt i rad.

        <br><br>

        Rekord:
        <strong>
          ${globalRecord}
        </strong>

      </div>


      <div class="actions">

        <button
          class="next-button"
          id="tryAgain"
        >

          Försök igen

        </button>


        <button
          class="secondary-button"
          id="backHome"
        >

          Till startsidan

        </button>

      </div>

    `;

    document
      .getElementById("tryAgain")
      .addEventListener("click", startRecordMode);

    document.getElementById("backHome").addEventListener("click", renderHome);
  }
}

/* BLANDA ARRAY */

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/* START */

renderHome();

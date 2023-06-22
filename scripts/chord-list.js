import { red_heart, empty_heart, search } from "./icons.js";

function createAudioPlaying(notes) {
  for (let key of Object.keys(notes)) {
    let note = new Audio();
    let src = document.createElement("source");
    src.type = "audio/mpeg";
    src.src = "../assets/" + key + ".mp3";
    note.appendChild(src);
    notes[key] = note;
  }

  return notes;
}

const notes = {
  A: undefined,
  "A%23": undefined,
  Ab: undefined,
  B: undefined,
  "B%23": undefined,
  Bb: undefined,
  C: undefined,
  "C%23": undefined,
  Cb: undefined,
  D: undefined,
  "D%23": undefined,
  Db: undefined,
  E: undefined,
  "E%23": undefined,
  Eb: undefined,
  F: undefined,
  "F%23": undefined,
  Fb: undefined,
  G: undefined,
  "G%23": undefined,
  Gb: undefined
};

export const AUDIOS = createAudioPlaying(notes);

function createChordListTemplate() {
  const templateString = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" />
  

    <style>
    *,
    ::after,
    ::before {
      margin: 0;
      box-sizing: border-box;
      font-size: 18px;
      font-family: Arial, Helvetica, sans-serif;
    }

    #chord-list {
      display: flex;
      align-items: stretch;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: stretch;
      padding: 20px;
    }
    
    .chord {
      background-color: #ffffff;
      border: 2px solid #ccc;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 30px;
      position: relative;
    }
    
    .chord-buttons {
      display: flex;
    }
    
    .chord-name {
      font-size: 24px;
      margin: 0 0 10px;
    }
    
    .chord-description {
      margin: 0 0 15px;
    }
    
    button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4caf50;
      color: #fff;
      border: none;
      border-radius: 5px;
      margin-right: 10px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
    }
    
    .export-csv {
      background-color: #2196f3;
    }
    
    .export-ascii {
      background-color: #ffc107;
    }

    .left-icon-buttons {
      padding: 0;
      background-color: transparent;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 30;
      margin: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }

    .left-icon-buttons button{
      background-color: transparent;
      width: 50px;
      padding: 0;
      z-index: 30;
      margin: 0;
    }

    .left-icon-buttons button img {
      width: 100%;
    }

    .speaker-icon:hover {
      background-color: transparent;
    }

    .speaker-icon img {
      width: 100%;
    }

    h1{
      font-size: 50px;
      text-align: center;
      margin-bottom: 10%;
    }

    .search-container {
      margin-bottom: 20px;
      display: flex;
    }

    .search-container input {
      padding: 10px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      width: 100%;
    }

    .search-container button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4caf50;
      color: #fff;
      border: none;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }

    .search-container button:hover {
      background-color: #45a049;
    }
    </style>

    <h1>Chords</h1>
    <div class="search-container">
    <input id="search-input" type="text" placeholder="Search chords...">
    <button id="search-button" class="search-button">${search}</button>
  </div>
    <button><a href="#createMelody">Start creating melody</a>
    </button>
    <section id="chord-list"></section>
    
    `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const chordListTemplate = createChordListTemplate();

// TODO delete this when php endpoints are ready
export let FavChordsTemp = [];

class ChordList extends HTMLElement {
  #_shadowRoot = null;
  chords = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(chordListTemplate.content.cloneNode(true));
  }

  searchChords = () => {
    const searchInput = this.#_shadowRoot.getElementById("search-input");
    const searchValue = searchInput.value.toLowerCase();
    const filteredChords = this.chords.filter(
      (chord) =>
        chord.name.toLowerCase().includes(searchValue) ||
        chord.description.toLowerCase().includes(searchValue)
    );
    this.renderChords(filteredChords);
  };

  addSearchButtonClickListener = () => {
    const searchButton = this.#_shadowRoot.getElementById("search-button");
    searchButton.addEventListener("click", this.searchChords);
  };

  getChordElement = (chord) => {
    return `
          <h2 class="chord-name">${chord.name} - ${chord.description}</h2>
        <chord-image notes="${chord.description}"></chord-image>    
        <div class="left-icon-buttons">
        <button id="listen-${chord.id}" class="listen speaker-icon"><img src="../assets/images/speaker-icon.svg"/></button>
        <button id="heart-button-${chord.id}" class="heart-button">${empty_heart}</button>
        </div>
        <button id="export-csv-${chord.id}" class="export-csv">Export as CSV</button>
        <button id="export-ascii-${chord.id}" class="export-ascii">Export as ASCII</button>
        <button id="button-json-${chord.id}" class="export-json">Export as JSON</button>`;
  };

  playChords = (chord) => {
    this.#_shadowRoot
      .getElementById(`listen-${chord.id}`)
      .addEventListener("click", () => {
        const chord_notes = chord.description.split("-");

        for (let i = 0; i < chord_notes.length; i++) {
          chord_notes[i] = chord_notes[i].replace("#", "%23");
          AUDIOS[chord_notes[i]].play();
        }
      });
  };

  exportChordToCSV = (chord) => {
    this.#_shadowRoot
      .getElementById(`export-csv-${chord.id}`)
      .addEventListener("click", () => {
        var csvExportElement = document.createElement("a");
        csvExportElement.setAttribute(
          "href",
          "data:text/csv;charset=utf-8, " +
            encodeURIComponent(chord.name) +
            "," +
            encodeURIComponent(chord.description)
        );
        csvExportElement.setAttribute("download", chord.name);

        this.#_shadowRoot.appendChild(csvExportElement);

        csvExportElement.click();
        this.#_shadowRoot.removeChild(csvExportElement);
      });
  };

  exportChordToASCII = (chord) => {
    this.#_shadowRoot
      .getElementById(`export-ascii-${chord.id}`)
      .addEventListener("click", () => {
        var asciiExportElement = document.createElement("a");
        asciiExportElement.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," +
            encodeURIComponent(chord.name) +
            " " +
            encodeURIComponent(chord.description)
        );
        asciiExportElement.setAttribute("download", chord.name);

        this.#_shadowRoot.appendChild(asciiExportElement);

        asciiExportElement.click();
        this.#_shadowRoot.removeChild(asciiExportElement);
      });
  };

  favoriteChord = (id) => {
    const chord = this.chords.find((obj) => obj.id === id);
    if (chord) {
      chord.favorite = true;
    }
    // this.chords[id] = { ...this.chords[id], favorite: true };
    // TODO here also add the fetch to the correct api when ready
    FavChordsTemp = this.chords;
  };

  unfavoriteChord = (id) => {
    const chord = this.chords.find((obj) => obj.id === id);
    if (chord) {
      chord.favorite = false;
    }
    // this.chords[id] = { ...this.chords[id], favourite: false };
    // TODO here also add the fetch to the correct api when ready
    FavChordsTemp = this.chords;
  };

  addFavoriteClickListener = (chord) => {
    this.#_shadowRoot
      .getElementById(`heart-button-${chord.id}`)
      .addEventListener("click", (event) => {
        event.preventDefault();

        if (this.chords.find((obj) => obj.id === chord.id)?.favorite) {
          this.#_shadowRoot.getElementById(
            `heart-button-${chord.id}`
          ).innerHTML = `${empty_heart}`;
          this.unfavoriteChord(chord.id);
        } else {
          this.#_shadowRoot.getElementById(
            `heart-button-${chord.id}`
          ).innerHTML = `${red_heart}`;

          this.favoriteChord(chord.id);
        }
      });
  };

  exportChordToJSON = (chord) => {
    this.#_shadowRoot
      .getElementById("button-json-" + chord.id)
      .addEventListener("click", () => {
        let JSONExportElement = document.createElement("a");
        JSONExportElement.setAttribute(
          "href",
          "data:text/json;charset=utf-8," +
            encodeURIComponent(
              JSON.stringify({
                name: chord.name,
                description: chord.description
              })
            )
        );
        JSONExportElement.setAttribute("download", chord.name + ".json");

        this.#_shadowRoot.appendChild(JSONExportElement);

        JSONExportElement.click();
        this.#_shadowRoot.removeChild(JSONExportElement);
      });
  };

  renderChords(chords) {
    if (!chords) {
      return;
    }

    const [chordList] = this.#_shadowRoot.querySelectorAll("#chord-list");
    chordList.innerHTML = "";

    if (chords.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "No matching chords found.";
      chordList.appendChild(noResultsMessage);
      return;
    }

    for (const chord of chords) {
      const chordElement = document.createElement("div");
      chordElement.setAttribute("id", `chord-${chord.id}`);
      chordElement.setAttribute("class", `chord`);

      chordElement.innerHTML = this.getChordElement(chord);

      chordList.appendChild(chordElement);

      this.#_shadowRoot.getElementById(
        `heart-button-${chord.id}`
      ).style.backgroundColor = this.chords.find((obj) => obj.id === chord.id)
        ?.favorite
        ? "red"
        : "transparent";

      this.playChords(chord);
      this.exportChordToCSV(chord);
      this.exportChordToASCII(chord);
      this.exportChordToJSON(chord);

      this.addFavoriteClickListener(chord);
    }
  }

  loadChords() {
    fetch("../php/chords/chord_endpoints_helper.php")
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("Error loading chords"))
      )
      .then((chords) => {
        this.chords = chords;
        this.renderChords(chords);
      })
      .catch((err) => console.error(err));

    // Search on enters
    const searchInput = this.#_shadowRoot.querySelector("#search-input");
    searchInput.addEventListener("keydown", (event) => {
      // if (event.keyCode === 13) {
      // Enter key is pressed
      const searchQuery = searchInput.value;
      this.searchChords(searchQuery);
      // }
    });
  }

  connectedCallback() {
    this.loadChords();
    this.addSearchButtonClickListener();
  }
}

customElements.define("chord-list-component", ChordList);

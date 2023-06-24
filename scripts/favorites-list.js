import { FavChordsTemp } from "./chord-list.js";
import { mainButton, mainButtonHover } from "./colors.js";
import { red_heart } from "./icons.js";

function createFavoritesListTemplate() {
  const templateString = `
    <style>
    *,
    ::after,
    ::before {
      margin: 0;
      box-sizing: border-box;
      font-size: 18px;
      font-family: Arial, Helvetica, sans-serif;
    }

    #favorites-list {
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
      background-color: ${mainButton};
      color: #fff;
      border: none;
      border-radius: 5px;
      margin-right: 10px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: ${mainButtonHover};
    }
    
    .export-csv {
      background-color: #2196f3;
    }
    
    .export-ascii {
      background-color: #ffc107;
    }

    .right-icon-buttons {
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

    .right-icon-buttons button{
      background-color: transparent;
      width: 50px;
      padding: 0;
      z-index: 30;
      margin: 0;
    }

    .right-icon-buttons button img {
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
    </style>

    <h1>Favorite Chords</h1>
    <section id="favorites-list"><section>
    `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const chordListTemplate = createFavoritesListTemplate();

class FavoritesList extends HTMLElement {
  #_shadowRoot = null;
  chords = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(chordListTemplate.content.cloneNode(true));
  }

  getChordElement = (chord) => {
    return `
          <h2 class="chord-name">${chord.name} - ${chord.description}</h2>
        <chord-image notes="${chord.description}"></chord-image>    
        <div class="right-icon-buttons">
        <button id="listen-${chord.id}" class="listen speaker-icon"><img src="../assets/images/speaker-icon.svg"/></button>
        <button id="heart-button-${chord.id}" class="heart-button">${red_heart}</button>
        </div>
        <button id="export-csv-${chord.id}" class="export-csv">Export as CSV</button>
        <button id="export-ascii-${chord.id}" class="export-ascii">Export as ASCII</button>`;
  };

  playChords = (chord) => {
    this.#_shadowRoot
      .getElementById(`listen-${chord.id}`)
      .addEventListener("click", () => {
        const chord_notes = chord.description.split("-");

        for (let i = 0; i < chord_notes.length; i++) {
          chord_notes[i] = chord_notes[i].replace("#", "%23");
        }

        var snd1 = new Audio();
        var src1 = document.createElement("source");
        src1.type = "audio/mpeg";
        src1.src = "../assets/" + chord_notes[0] + ".mp3";
        snd1.appendChild(src1);

        var snd2 = new Audio();
        var src2 = document.createElement("source");
        src2.type = "audio/mpeg";
        src2.src = "../assets/" + chord_notes[1] + ".mp3";
        snd2.appendChild(src2);

        var snd3 = new Audio();
        var src3 = document.createElement("source");
        src3.type = "audio/mpeg";
        src3.src = "../assets/" + chord_notes[2] + ".mp3";
        snd3.appendChild(src3);

        snd1.play();
        snd2.play();
        snd3.play();
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

  unfavoriteChord = (id) => {
    // TODO here also add the delete from favs endpoint
    const chord = this.#_shadowRoot.querySelector(`#chord-${id}`);
    this.#_shadowRoot.getElementById(`favorites-list`).removeChild(chord);
  };

  addFavoriteClickListener = (chord) => {
    this.#_shadowRoot
      .getElementById(`heart-button-${chord.id}`)
      .addEventListener("click", (event) => {
        event.preventDefault();

        if (this.chords.find((obj) => obj.id === chord.id)?.favorite) {
          this.unfavoriteChord(chord.id);
        }
      });
  };

  renderChords(chords) {
    if (!chords) {
      return;
    }

    const [chordList] = this.#_shadowRoot.querySelectorAll("#favorites-list");
    chordList.innerHTML = "";

    for (const chord of chords) {
      const chordElement = document.createElement("div");
      chordElement.setAttribute("id", `chord-${chord.id}`);
      chordElement.setAttribute("class", `chord`);

      chordElement.innerHTML = this.getChordElement(chord);

      chordList.appendChild(chordElement);

      this.playChords(chord);
      this.exportChordToCSV(chord);
      this.exportChordToASCII(chord);
      this.addFavoriteClickListener(chord);
    }
  }

  loadChords() {
    // TODO here change it with the favorites endpoint
    // fetch("../php/chords/chord_endpoints_helper.php")
    //   .then((res) =>
    //     res.ok ? res.json() : Promise.reject(new Error("Error loading chords"))
    //   )
    //   .then((chords) => {
    //     this.chords = chords;
    //     this.renderChords(chords);
    //   })
    //   .catch((err) => console.error(err));
    const filtered = FavChordsTemp.filter((chord) => chord?.favorite === true);
    this.chords = filtered;
    this.renderChords(filtered);
  }

  connectedCallback() {
    this.loadChords();
  }
}

customElements.define("favorites-list-component", FavoritesList);
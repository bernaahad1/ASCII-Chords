import { AUDIOS } from "./chord-list.js";

function createCreateMelodyTemplate() {
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

    #create-melody {
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
    </style>

    <h1>Creating melody</h1>
    <div id="melody-info"></div>
    <button type="button" id="play_melody">Play Melody</button>
    <button type="button" id="export-melody-csv">Export to CSV!</button>
    <button type="button" id="export-melody-json">Export to JSON!</button>
    <button type="button" id="export-melody-ascii">Export to ASCII!</button>
    <section id="create-melody"></section>
   
    `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const createMelodyTemplate = createCreateMelodyTemplate();

// TODO delete this when php endpoints are ready
export let FavChordsTemp = [];

class CreateMelody extends HTMLElement {
  #_shadowRoot = null;
  chords = null;
  melody = [];

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(createMelodyTemplate.content.cloneNode(true));
  }

  getChordElement = (chord) => {
    return `
          <h2 class="chord-name">${chord.name} - ${chord.description}</h2>
        <chord-image notes="${chord.description}"></chord-image>    
        <div class="left-icon-buttons">
        <button id="listen-${chord.id}" class="listen speaker-icon"><img src="../assets/images/speaker-icon.svg"/></button>
        <button id="heart-button-${chord.id}" class="heart-button"><img src="../assets/images/heart-solid.svg"/></button>
        </div>
        <button id="button-to-melody-${chord.id}" class="heart-button">Add to melody</button>
        `;
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
          event.target.style.backgroundColor = "transparent";
          this.unfavoriteChord(chord.id);
        } else {
          event.target.style.backgroundColor = "red";
          this.favoriteChord(chord.id);
        }
      });
  };

  addToMelody = (chord) => {
    this.#_shadowRoot
      .getElementById("button-to-melody-" + chord.id)
      .addEventListener("click", () => {
        this.melody.push(chord);

        const container = this.#_shadowRoot.getElementById("melody-info");

        const chordExportToASCIIButton = document.createElement("button");
        const number = this.melody.length - 1;

        chordExportToASCIIButton.setAttribute("id", "button-chord-" + number);
        chordExportToASCIIButton.innerHTML =
          this.melody[this.melody.length - 1].name + " -";
        container.appendChild(chordExportToASCIIButton);

        this.removeChordFromMelody(this.melody.length - 1);
      });
  };

  delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  removeChordFromMelody = (index) => {
    const chordButton = this.#_shadowRoot.getElementById(
      "button-chord-" + index
    );

    if (!chordButton) {
      return;
    }

    chordButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.target.remove();

      this.melody[index] = null;
    });
  };

  exportMelodyToCsv = () => {
    this.#_shadowRoot
      .getElementById("export-melody-csv")
      .addEventListener("click", () => {
        let csvExportElement = document.createElement("a");

        let InfoForExport = "";
        for (let i = 0; i < this.melody.length; i++) {
          if (this.melody[i] != null) {
            InfoForExport +=
              encodeURIComponent(this.melody[i].name) +
              "," +
              encodeURIComponent(this.melody[i].description) +
              "\n";
          }
        }

        csvExportElement.setAttribute(
          "href",
          "data:text/csv;charset=utf-8," + InfoForExport
        );
        csvExportElement.setAttribute("download", "melody");

        this.#_shadowRoot.appendChild(csvExportElement);

        csvExportElement.click();
        this.#_shadowRoot.removeChild(csvExportElement);
      });
  };

  exportMelodyToAscii = () => {
    this.#_shadowRoot
      .getElementById("export-melody-ascii")
      .addEventListener("click", () => {
        let csvExportElement = document.createElement("a");

        let InfoForExport = "";
        for (let i = 0; i < this.melody.length; i++) {
          if (this.melody[i] != null) {
            InfoForExport +=
              encodeURIComponent(this.melody[i].name) +
              "|" +
              encodeURIComponent(this.melody[i].description) +
              "\n";
          }
        }

        csvExportElement.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + InfoForExport
        );
        csvExportElement.setAttribute("download", "melody");

        this.#_shadowRoot.appendChild(csvExportElement);

        csvExportElement.click();
        this.#_shadowRoot.removeChild(csvExportElement);
      });
  };

  exportMelodyToJson = () => {
    this.#_shadowRoot
      .getElementById("export-melody-json")
      .addEventListener("click", () => {
        let csvExportElement = document.createElement("a");

        let InfoForExport = "";
        for (let i = 0; i < this.melody.length; i++) {
          if (this.melody[i] != null) {
            InfoForExport += encodeURIComponent(
              JSON.stringify({
                name: this.melody[i].name,
                description: this.melody[i].description
              })
            );
          }
        }

        csvExportElement.setAttribute(
          "href",
          "data:text/json;charset=utf-8," + InfoForExport
        );
        csvExportElement.setAttribute("download", "melody" + ".json");

        this.#_shadowRoot.appendChild(csvExportElement);

        csvExportElement.click();
        this.#_shadowRoot.removeChild(csvExportElement);
      });
  };

  playMelody = async () => {
    for (let i = 0; i < this.melody.length; i++) {
      if (this.melody[i] != null) {
        const chord_notes = this.melody[i].description.split("-");
        for (let j = 0; j < chord_notes.length; j++) {
          chord_notes[j] = chord_notes[j].replace("#", "%23");
          AUDIOS[chord_notes[j]].play();
        }
        await this.delay(1300);

      }
    }
  };

  renderChords(chords) {
    if (!chords) {
      return;
    }

    const [createMelody] = this.#_shadowRoot.querySelectorAll("#create-melody");
    createMelody.innerHTML = "";

    for (const chord of chords) {
      const chordElement = document.createElement("div");
      chordElement.setAttribute("id", `chord-${chord.id}`);
      chordElement.setAttribute("class", `chord`);

      chordElement.innerHTML = this.getChordElement(chord);

      createMelody.appendChild(chordElement);

      this.#_shadowRoot.getElementById(
        `heart-button-${chord.id}`
      ).style.backgroundColor = this.chords.find((obj) => obj.id === chord.id)
        ?.favorite
        ? "red"
        : "transparent";

      this.playChords(chord);

      this.addFavoriteClickListener(chord);

      this.#_shadowRoot
        .getElementById("play_melody")
        .addEventListener("click", this.playMelody);

      this.addToMelody(chord);
    }

    this.exportMelodyToCsv();
    this.exportMelodyToJson();
    this.exportMelodyToAscii();
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
  }

  connectedCallback() {
    this.loadChords();
  }
}

customElements.define("create-melody-component", CreateMelody);

import { AUDIOS, renderModalAlert } from "./utils.js";
import { empty_heart, red_heart, play_audio, delete_audio } from "./icons.js";
import { colors } from "./colors.js";

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
      margin: 0 10px 30px 10px;
      position: relative;
      flex-grow: 1;
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
      background-color: ${colors.mainButton};
      color: #fff;
      border: none;
      border-radius: 5px;
      margin-right: 10px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: ${colors.mainButtonHover};
    }

    button.melody-options:hover{
      color: black
    }
    
    .melody-options {
      background-color: ${colors.white};
      margin: 10px;
      border: 2px solid ${colors.mainButton};
      color: teal;
    }

    .right-icon-buttons {
      padding: 0;
      background-color: transparent;
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
      margin-top: 10%;

    }

    .header-part{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    #melody-info{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

    }

    .div-chord{
      border: 2px solid #ccc;
      padding: 10px;
      margin: 5px;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
    }

    #right-melody-chord-buttons{
      display: flex;
      justify-content: flex-end;
      flex-direction: row;
      margin-left: 10px;
    }

    #right-melody-chord-buttons button{
      padding: 0;
      margin-right: 0;
      margin-left: 10px;
      background-color: transparent;
    }

    #melody-buttons{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
    }
    </style>

    <h1>Creating melody</h1>
    <div id="melody-info"></div>
    <div id="melody-buttons">
    <button type="button" id="play_melody" class="melody-options">Play Melody</button>
    <button type="button" id="export-melody-csv" class="melody-options">Export as CSV</button>
    <button type="button" id="export-melody-ascii" class="melody-options">Export as ASCII</button>
    <button type="button" id="export-melody-json" class="melody-options">Export as JSON</button>
    </div>
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
        <div class="header-part">
        <div class="left-icon-buttons">
          <h2 class="chord-name">${chord.name} - ${chord.description}</h2>
        <chord-image notes="${chord.description}"></chord-image>    
        </div>
        <div class="right-icon-buttons">
        <button id="listen-${chord.id}" class="listen speaker-icon"><img src="../assets/images/speaker-icon.svg"/></button>
        </div>
        </div>
        <button id="button-to-melody-${chord.id}" class="heart-button">Add to melody</button>
        `;
  };

  playChords = (chord, buttonID) => {
    this.#_shadowRoot.getElementById(buttonID).addEventListener("click", () => {
      const chord_notes = chord.description.split("-");

      for (let i = 0; i < chord_notes.length; i++) {
        chord_notes[i] = chord_notes[i].replace("#", "%23");
        AUDIOS[chord_notes[i]].play();
      }
    });
  };

  addToMelody = (chord) => {
    this.#_shadowRoot
      .getElementById("button-to-melody-" + chord.id)
      .addEventListener("click", () => {
        this.melody.push(chord);

        const container = this.#_shadowRoot.getElementById("melody-info");

        //new:
        const chordInMelodyDiv = document.createElement("div");
        const number = this.melody.length - 1;
        chordInMelodyDiv.setAttribute("id", "div-chord-" + number);
        chordInMelodyDiv.setAttribute("class", "div-chord");

        chordInMelodyDiv.innerHTML = `<p>${
          this.melody[this.melody.length - 1].name
        }</p>
        <div id="right-melody-chord-buttons">
        <button id="button-play-chord-${number}">${play_audio}</button>
        <button id="button-delete-chord-${number}">${delete_audio}</button>
        </div>`;

        container.appendChild(chordInMelodyDiv);

        this.playChords(chord, "button-play-chord-" + number);

        this.#_shadowRoot
          .querySelector(`#button-delete-chord-${number}`)
          .addEventListener("click", () => {
            chordInMelodyDiv.remove();
            this.melody[number] = null;
          });
      });
  };

  delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  exportMelodyToCsv = () => {
    this.#_shadowRoot
      .getElementById("export-melody-csv")
      .addEventListener("click", () => {
        if (
          this.melody.length == 0 ||
          this.melody.every((element) => element === null)
        ) {
          renderModalAlert(
            "Please include chords in the melody!",
            "Continue",
            () => {}
          );
          return;
        }

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
        if (
          this.melody.length == 0 ||
          this.melody.every((element) => element === null)
        ) {
          renderModalAlert(
            "Please include chords in the melody!",
            "Continue",
            () => {}
          );
          return;
        }

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
        if (
          this.melody.length == 0 ||
          this.melody.every((element) => element === null)
        ) {
          renderModalAlert(
            "Please include chords in the melody!",
            "Continue",
            () => {}
          );
          return;
        }

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

      this.playChords(chord, `listen-${chord.id}`);

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
    fetch("../php/chords/ChordEndpoints.php")
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

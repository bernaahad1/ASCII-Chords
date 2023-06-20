function createChordImageTemplate() {
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
  
      .image-container {
        position: relative;
        border: 1px black solid;
        max-width: 200px;
        margin: 20px;
      }

      .lines {
        display: block;
        max-width: 100%;
      }

      .note {
        position: absolute;
        left: 0;
        /* z-index: 1; */
        /* width: 20%; */
        left: 50%;
      }
      .note img {
        width: 100%;
      }

      #note-line-1 {
        width: 120%;
        height: 3px;
        background-color: black;
        position: absolute;
        top: 45%;
        left: -10%;
      }
      .note .sign{
        position: absolute;
        width: 30%;
        left: -40%
      }
      
      </style>
  
        <div class="image-container">
          <img class="lines" src="../assets/images/lines.png" />
          
        </div>
    `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const chordImageTemplate = createChordImageTemplate();

class ChordImage extends HTMLElement {
  #_shadowRoot = null;
  notes = null;
  container = null;
  chords = {
    C: 1,
    D: 2,
    E: 3,
    F: 4,
    G: 5,
    A: 6,
    B: 7
  };

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(chordImageTemplate.content.cloneNode(true));

    this.notes = this.getAttribute("notes")?.split("-");
    this.container = this.#_shadowRoot.querySelector(".image-container");
  }

  renderChords = () => {
    this.notes.forEach((element) => {
      let note = element;
      let signElement = null;
      if (element.length > 1) {
        note = element[0];
        const sign = element[1].replace("#", "%23");
        if (sign) {
          signElement = `<img class="sign" src="../assets/images/${sign}.png" />`;
        }
      }

      this.container.innerHTML += `<div class="note" id="note-${
        this.chords[note]
      }">
      ${signElement ? signElement : ""}
            <img src="../assets/images/note.png" />
            <div id="note-line-${this.chords[note]}"></div>
          </div>`;

      if (this.chords[note] !== 1) {
        this.#_shadowRoot.querySelector(
          `#note-line-${this.chords[note]}`
        ).style.display = "none";
      }

      const noteElement = this.#_shadowRoot.querySelector(
        `.image-container #note-${this.chords[note]}`
      );

      noteElement.style.width = "20%";

      //Bottom
      const bottom = (this.chords[note] - 2) * 8.5;
      noteElement.style.bottom = `${bottom}%`;
    });
  };

  connectedCallback() {
    this.renderChords();
  }
}

customElements.define("chord-image", ChordImage);

import { colors } from "./colors.js";

function createImportTemplate() {
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

      .import {
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px;
        align-content: center;
      }
      
      h1{
        font-size: 50px;
        text-align: center;
        margin-bottom: 10%;
        margin-top: 10%;
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

    </style>

    <h1>Chords</h1>
    <div class="import">
      <input type="file" id="fileInput" accept=".csv, .json, .txt*" >
      <button type="button" id="import">Import</button>
    </div>
  `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const importTemplate = createImportTemplate();

class ImportComponent extends HTMLElement {
  #_shadowRoot = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(importTemplate.content.cloneNode(true));
  }
}

customElements.define("import-component", ImportComponent);

import { colors } from "./colors.js";
import { handleException, renderModalAlert } from "./utils.js";

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
        margin-bottom: 2%;
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

      #info {
        text-align: left;
        margin-bottom: 30px;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0px 0px 2px 0px black;
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
        justify-content: center;
      }

      li {
        margin-top: 10px;
        margin-bottom: 10px;
      }

    </style>

    <h1>Import</h1>
    <div class="import">
    <div id="info">
      <p> You have three options for import: </p>
      <ol>
        <li> <b> CSV file with one or more lines where each line should have the following structure: </b>
          <p> [name], [description] </p>
          <p> For example: C major, C-E-G </p> 
        </li>
        <li> <b> ASCII file with extension .txt with one or more lines where each line should have the following structure: </b>
          <p> [name] | [description] </p> 
          <p> For example: C major | C-E-G </p>
        </li>
        <li> <b> JSON file file with one or more records where each record should have the following structure: </b>
          <p> {“name”: “[name]”, “description”: “[description]”}. </p>  
          <p> For example: {“name”: “C major”, “description”: “C-E-G"} </p>
        </li>
      <ol>
    </div>
    <form>
      <input type="file" id="fileInput" accept=".csv, .json, .txt" >
      <button type="button" id="import">Import</button>
    </form>
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

  handleFileSelect = async (event) => {
    event.preventDefault();

    let file = event.target.files[0];

    let fileReader = new FileReader();

    if (!file) {
      return;
    }

    fileReader.readAsText(file);

    fileReader.onload = (event) => {
      let fileAsText = event.target.result;

      fileAsText = fileAsText.replaceAll("#", "%23");

      let fileExtension = file.name.split(".").pop();

      if (fileExtension.toLowerCase() === "txt") {
        if (!fileAsText) {
          renderModalAlert("Empty file!", "Continue", () => {});
          return;
        }

        this.importTXT(fileAsText);
        return;
      }

      if (fileExtension.toLowerCase() === "csv") {
        if (!fileAsText) {
          renderModalAlert("Empty file!", "Continue", () => {});
          return;
        }

        this.importCSV(fileAsText);
        return;
      }

      if (fileExtension.toLowerCase() === "json") {
        if (!fileAsText) {
          renderModalAlert("Empty file!", "Continue", () => {});
          return;
        }

        this.importJSON(fileAsText);
        return;
      }
    };
  };

  recreateButton(el) {
    var newEl = el.cloneNode(false);
    while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
    el.parentNode.replaceChild(newEl, el);
  }

  importTXT = (fileAsText) => {
    let fileLines = fileAsText.split(/[\r\n]+/g);

    const postFunction = () => {
      this.postFile(
        "../php/import/ImportEndpoints.php?txt_file_path=" + fileLines
      );
    };

    const importButton = this.#_shadowRoot.getElementById("import");
    this.recreateButton(importButton);

    this.#_shadowRoot
      .getElementById("import")
      .addEventListener("click", postFunction);
  };

  importCSV = (fileAsText) => {
    const string_after_splitting = fileAsText.split(",");
    const fileAsText1 = string_after_splitting.join(";");
    let fileLines = fileAsText1.split(/[\r\n]+/g);

    const postFunction = () => {
      this.postFile(
        "../php/import/ImportEndpoints.php?csv_file_path=" + fileLines
      );
    };

    const importButton = this.#_shadowRoot.getElementById("import");

    this.recreateButton(importButton);

    this.#_shadowRoot
      .getElementById("import")
      .addEventListener("click", postFunction);
  };

  importJSON = (fileAsText) => {
    let temp = "";
    let jsonAsArray = [];
    for (let i = 0; i < fileAsText.length; i++) {
      temp += fileAsText[i];
      if (fileAsText[i] == "}") {
        jsonAsArray.push(JSON.parse(temp));
        temp = "";
      }
    }

    const postFunction = () => {
      this.postFile(
        "../php/import/ImportEndpoints.php?json_file_path=" +
          JSON.stringify(jsonAsArray)
      );
    };

    const importButton = this.#_shadowRoot.getElementById("import");

    this.recreateButton(importButton);

    this.#_shadowRoot
      .getElementById("import")
      .addEventListener("click", postFunction);
  };

  postFile = (url) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "text/plain charset=UTF-8"
      }
    })
      .then((res) => {
        if (res.status === 200) {
          return;
        }

        if (res.ok) {
          return;
        }

        throw res;
      })
      .catch((message) => {
        handleException(message);
      });
  };

  onLoad = (event) => {
    this.#_shadowRoot
      .getElementById("fileInput")
      .addEventListener("change", this.handleFileSelect, false);
  };

  connectedCallback() {
    this.onLoad();
  }
}

customElements.define("import-component", ImportComponent);

import { colors } from "./colors.js";
import { handleException } from "./utils.js";

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
    <form>
      <input type="file" id="fileInput" accept=".csv, .json, .txt*" >
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
    let file = event.target.files[0];
    console.log("selected", file);

    let fileReader = new FileReader();

    if (!file) {
      return;
    }

    fileReader.readAsText(file);

    fileReader.onload = (event) => {
      let fileAsText = event.target.result;
      console.log("try");
      fileAsText = fileAsText.replaceAll("#", "%23");

      let fileExtension = file.name.split(".").pop();

      if (fileExtension.toLowerCase() === "txt") {
        if (!fileAsText) {
          console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        }
        
        this.importTXT(fileAsText);
        return;
      }

      if (fileExtension.toLowerCase() === "csv") {
        if (!fileAsText) {
          console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        }
        
        this.importCSV(fileAsText);
        return;
      }

      if (fileExtension.toLowerCase() === "json") {
        if (!fileAsText) {
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
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

    // importButton.replaceWith(importButton.clone());

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
        console.log("res", res);
        if (res.status === 200) {
          this.#_shadowRoot.querySelector("form").reset();
          this.#_shadowRoot.querySelector("input").value = "";
          const importButton = this.#_shadowRoot.getElementById("import");

          this.recreateButton(importButton);

          return;
        }

        if (res.ok) {
          return;
        }

        throw res;
      })
      .then(() => {
        this.#_shadowRoot.getElementById(
          `heart-button-${chord.id}`
        ).innerHTML = `${red_heart}`;
      })
      .catch((message) => {
        console.log("aloo");
        handleException(message);
      });
  };

  onLoad = (event) => {
    this.#_shadowRoot
      .getElementById("fileInput")
      .addEventListener("change", this.handleFileSelect, false);
  };

  connectedCallback() {
    console.log("import-form component");
    this.onLoad();
  }
}

customElements.define("import-component", ImportComponent);

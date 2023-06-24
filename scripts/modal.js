function createModalTemplate() {
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
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 345;
      }

      .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
      }
      
      .message {
        margin-bottom: 20px;
      }

      .button {
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }


    </style>
    <div class="modal">
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const modalTemplate = createModalTemplate();

class Modal extends HTMLElement {
  #_shadowRoot = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
  }
}

customElements.define("modal-component", Modal);

import { validateUsername, displayError } from "./form.js";

function createLoginTemplate() {
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
    
    form {
      margin: 5% auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 600px;
      padding: 20px 10px;
      font-size: 18px; 
      font-family: Arial, Helvetica, sans-serif;
    }

    label {
      padding: 5px;
      width: 90%;
      display: flex;
      flex-direction: row;
      flex-direction: column;
      align-items: stretch;
      margin-top: 10px;
    }

    input {
      flex-grow: 1;
      padding: 5px;
      border-radius: 8px;
      border-width: 2px;
      border-style: solid;
    }

    input:focus-visible,
    select:focus-visible {
      border-color: #42422f;
      outline: 0;
    }

    p {
      font-size: 22px;
    }

    h1 {
      font-size: 34px;
      align-self: center;
      padding-bottom: 10px;
      font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
      font-weight: 200;
    }

    .error {
      color: red;
      font-size: 16px;
    }

    #success {
      color: green;
      text-align: center;
      font-size: 30px;
    }

    #login-btn-container {
      width: 90%;
    }

    #login-btn {
      width: 100%;
      padding: 10px 5px;
      background: #82aed4;
      border: none;
      margin-top: 20px;
      border-radius: 10px;
      font-size: 26px;
      color: white;
    }

    #login-btn {
      width: 100%;
      padding: 10px 5px;
      background: #82aed4;
      border: none;
      margin-top: 20px;
      border-radius: 10px;
      font-size: 26px;
      color: white;
    }

    #login-btn:active {
      background: #688eaf;
    }
  </style>

  <form id="login-form">
    <h1>Log In</h1>

    <label for="email">
      <p>Email</p>
      <input type="email" id="email" required />
      <span class="error" id="email-error"></span>
    </label>

    <label for="password">
      <p>Password</p>
      <input
        type="password"
        id="password"
        minlength="2"
        maxlength="10"
        required
      />
      <span class="error" id="password-error"></span>
    </label>

    <div id="login-btn-container">
      <button type="submit" id="login-btn">login</button>
    </div>
  </form>
  <div id="success"></div>`;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const loginTemplate = createLoginTemplate();

class LoginForm extends HTMLElement {
  #_shadowRoot = null;
  loginForm = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(loginTemplate.content.cloneNode(true));

    this.loginForm = this.#_shadowRoot.getElementById("login-form");
    this.loginForm.addEventListener("submit", this.onRegisterClick.bind(this));
  }

  onRegisterClick = async (event) => {
    event.preventDefault();

    const loginForm = this.#_shadowRoot.getElementById("login-form");
    const form = this.#_shadowRoot.getElementById("login-form").elements;
    let formData = new FormData();

    formData.append("email", form[0].value);
    formData.append("password", form[1].value);

    const loginFormInput = {
      email: form[0].value,
      password: form[1].value
    };

    try {
      fetch("../php/authentication/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      location.hash = "#chords";

      console.log("successs");

      fetch("../php/authentication/login.php", {
        method: "POST",
        body: JSON.stringify(loginFormInput)
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            loginForm.reset();
            console.log("loggeeed");
            location.hash = "#chords";
          } else {
            console.log("error");
            location.hash = "#home";
          }
        });
    } catch (error) {
      console.log("error");

      console.log("Error:", error);
    }
  };

  connectedCallback() {
    console.log("login-form component");
  }
}

customElements.define("login-form-component", LoginForm);

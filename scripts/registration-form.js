import { onRegistration } from "./utils.js";
import { colors } from "./colors.js";
import { handleException } from "./utils.js";
import {
  validateEmail,
  validateFamilyName,
  validateName,
  validatePassword,
  validateUsername
} from "./form-validation.js";

function createRegistrationTemplate() {
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
      margin-bottom: 10%;
      margin-top: 10%;
      font-family: Arial, sans-serif;
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

    #register-btn-container {
      width: 90%;
    }

    #register-btn {
    width: 100%; 
    margin-top: 20px;
    font-size: 26px;
    padding: 10px 20px;
    background-color: ${colors.mainButton};
    color: ${colors.white};
    border: none;
    border-radius: 10px;
    margin-right: 10px;
    cursor: pointer;

    }

    #register-btn:hover {
      background-color: ${colors.mainButtonHover};
    }

    #register-btn:active {
      background: #688eaf;
    }
  </style>

  <form id="registration-form">
    <h1>Registration</h1>

    <label for="username">
      <p>Username</p>
      <input type="text" id="username" minlength="3" required />
      <p class="error" id="username-error"></p>
    </label>

    <label for="name">
      <p>Name</p>
      <input type="text" id="name" maxlength="50" required />
      <span class="error" id="name-error"></span>
    </label>

    <label for="family-name">
      <p>Family name</p>
      <input type="text" id="family-name" maxlength="50" required />
      <span class="error" id="family-name-error"></span>
    </label>

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
        required
      />
      <span class="error" id="password-error"></span>
    </label>

    <div id="register-btn-container">
      <button type="submit" id="register-btn">Register</button>
    </div>
  </form>
  <div id="success"></div>`;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const registrationTemplate = createRegistrationTemplate();

class RegistrationForm extends HTMLElement {
  #_shadowRoot = null;
  button = null;
  registrationForm = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(registrationTemplate.content.cloneNode(true));

    this.registrationForm =
      this.#_shadowRoot.getElementById("registration-form");

    this.registrationForm.addEventListener(
      "submit",
      this.onRegisterClick.bind(this)
    );
  }

  onRegisterClick = async (event) => {
    event.preventDefault();

    const registrationForm =
      this.#_shadowRoot.getElementById("registration-form");
    const form = this.#_shadowRoot.getElementById("registration-form").elements;

    const loginFormInput = {
      username: form[0].value,
      first_name: form[1].value,
      last_name: form[2].value,
      email: form[3].value,
      password: form[4].value
    };

    if (
      !(
        validateUsername(loginFormInput.username, this.#_shadowRoot) &&
        validateName(loginFormInput.first_name, this.#_shadowRoot) &&
        validateFamilyName(loginFormInput.last_name, this.#_shadowRoot) &&
        validateEmail(loginFormInput.email, this.#_shadowRoot) &&
        validatePassword(loginFormInput.password, this.#_shadowRoot)
      )
    ) {
      return;
    }

    fetch("../php/register/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginFormInput)
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }

        if (res.ok) {
          return;
        }
        throw res;
      })
      .then((res) => {
        if (res.success) {
          registrationForm.reset();
          onRegistration();
        }
      })
      .catch((err) => {
        handleException(err);
      });
  };
}

customElements.define("registration-form-component", RegistrationForm);

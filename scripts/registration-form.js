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

    #register-btn-container {
      width: 90%;
    }

    #register-btn {
      width: 100%;
      padding: 10px 5px;
      background: #82aed4;
      border: none;
      margin-top: 20px;
      border-radius: 10px;
      font-size: 26px;
      color: white;
    }

    #register-btn {
      width: 100%;
      padding: 10px 5px;
      background: #82aed4;
      border: none;
      margin-top: 20px;
      border-radius: 10px;
      font-size: 26px;
      color: white;
    }

    #register-btn:active {
      background: #688eaf;
    }
  </style>

  <form id="registration-form">
    <h1>Registration</h1>

    <label for="username">
      <p>Username</p>
      <input type="text" id="username" minlength="3" maxlength="10" required />
      <p class="error" id="username-error"></p>
    </label>

    <label for="name">
      <p>Name</p>
      <input type="text" id="name" maxlength="50" required />
    </label>

    <label for="family-name">
      <p>Family name</p>
      <input type="text" id="family-name" maxlength="50" required />
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
        minlength="6"
        maxlength="10"
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

    let formData = new FormData();
    console.log(form);
    formData.append("username", form[0].value);
    formData.append("password", form[2].value);
    try {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });

      registrationForm.reset();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  connectedCallback() {
    console.log("login-form component");
  }
}

customElements.define("registration-form-component", RegistrationForm);

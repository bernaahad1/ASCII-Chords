import { colors } from "./colors.js";
import { handleException } from "./utils.js";

function createUserProfileTemplate() {
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
  
      <style>
            .profile-container {
              font-family: Arial, sans-serif;
              max-width: 400px;
              margin: 0 auto;
            }
            h1 {
              font-size: 34px;
              align-self: center;
              margin-bottom: 10%;
              margin-top: 10%;
              font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
                "Lucida Sans", Arial, sans-serif;
              font-weight: 200;
            }
            h2 {
              text-align: center;
            }
            .field {
              display: flex;
              margin-bottom: 10px;
              flex-direction: row;
              align-items: center;
            }
            .field label {
              font-weight: bold;
              width: 100px;
            }
            .field input {
              flex: 1;
              padding: 5px;
            }
            .edit-button {
              display: block;
              margin: 10px auto;
            }
            .error-message {
              color: red;
              margin: 10px 0;
            }
            .loader {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 200px;
              font-family: Arial, sans-serif;
            }
            .hidden{
              display: none;
            }
            h1{
              font-size: 50px;
              text-align: center;
              margin-bottom: 10%;
            }
            
            .edit-button,
            .save-button {
              margin: 10px auto;
              padding: 8px 16px;
              font-size: 16px;
              border: none;
              border-radius: 4px;
              background-color: ${colors.mainButton};
              color: #fff;
              cursor: pointer;
              transition: background-color 0.3s;
            }

            .save-button {
              display: none;
              margin: 10px auto;
              background-color: ${colors.highlight}
            }

            .edit-button:hover{
              background-color: ${colors.mainButtonHover};
            }

            .save-button:hover {
              background-color: ${colors.highlightHover}
            }

            .edit-button[disabled],
            .save-button[disabled] {
              opacity: 0.6;
              cursor: not-allowed;
            }
          </style>
  
          <div class="initial loader">
          <p>Loading user information...</p>
        </div>
    `;

  const templateElement = document.createElement("template");
  templateElement.innerHTML = templateString;
  return templateElement;
}

const userProfileTemplate = createUserProfileTemplate();

class UserProfile extends HTMLElement {
  #_shadowRoot = null;
  user = null;

  constructor() {
    super();
    this.#_shadowRoot = this.attachShadow({ mode: "closed" });
    this.#_shadowRoot.appendChild(userProfileTemplate.content.cloneNode(true));
  }

  setupEditButton() {
    const editButton = this.#_shadowRoot.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
      this.enableEditMode();
    });
  }

  enableEditMode() {
    const firstNameInput = this.#_shadowRoot.querySelector(".first-name");
    const lastNameInput = this.#_shadowRoot.querySelector(".last-name");
    const usernameInput = this.#_shadowRoot.querySelector(".username");
    const saveButton = this.#_shadowRoot.querySelector(".save-button");

    firstNameInput.disabled = false;
    lastNameInput.disabled = false;
    usernameInput.disabled = false;

    saveButton.style.display = "block";
  }

  fetchUserInformation() {
    fetch("../php/user/UserEndpoints.php", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
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
      .then((user) => {
        this.user = user;
        this.removeInitialLoader();
        this.renderUser();
        this.setupEditButton();
      })
      .catch((err) => {
        handleException(err);
      });
  }

  removeInitialLoader() {
    this.#_shadowRoot.querySelector(".initial.loader").style.display = "none";
  }

  saveUserInformation() {
    const firstNameInput = this.#_shadowRoot.querySelector(".first-name");
    const lastNameInput = this.#_shadowRoot.querySelector(".last-name");
    const emailInput = this.#_shadowRoot.querySelector(".email");
    const usernameInput = this.#_shadowRoot.querySelector(".username");
    const saveButton = this.#_shadowRoot.querySelector(".save-button");
    const editButton = this.#_shadowRoot.querySelector(".edit-button");
    const errorMessage = this.#_shadowRoot.querySelector(".error-message");
    const loader = this.#_shadowRoot.querySelector(".saving.loader");

    const updatedFirstName = firstNameInput.value.trim();
    const updatedLastName = lastNameInput.value.trim();
    const updatedEmail = emailInput.value.trim();
    const updatedUsername = usernameInput.value.trim();

    errorMessage.textContent = "";
    firstNameInput.disabled = true;
    lastNameInput.disabled = true;
    emailInput.disabled = true;
    usernameInput.disabled = true;
    saveButton.disabled = true;
    editButton.disabled = true;

    loader.classList.remove("hidden");

    const editedInfo = {
      username: updatedUsername,
      first_name: updatedFirstName,
      last_name: updatedLastName,
      email: updatedEmail
    };

    fetch("../php/user/UserEndpoints.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editedInfo)
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }

        if (res.ok) {
          return;
        }
        throw res.statusText;
      })
      .then((user) => {
        this.user = user;
        saveButton.style.display = "none";
        editButton.disabled = false;
        errorMessage.textContent = "";
        loader.classList.add("hidden");

        saveButton.disabled = false;
      })
      .catch((error) => {
        errorMessage.textContent = error;
        loader.classList.add("hidden");

        // Re-enable the input fields and the save button
        firstNameInput.disabled = false;
        lastNameInput.disabled = false;
        usernameInput.disabled = false;
        saveButton.disabled = false;
        editButton.disabled = false;
      });
  }

  renderUser() {
    const { first_name, last_name, email, username } = this.user || {};

    this.#_shadowRoot.innerHTML += `
    <div class="profile-container">
      <h1>Profile</h1>
      <div class="field">
        <label>First Name:</label>
        <input type="text" class="first-name" value="${first_name}" disabled>
      </div>
      <div class="field">
        <label>Last Name:</label>
        <input type="text" class="last-name" value="${last_name}" disabled>
      </div>
      <div class="field">
        <label>Email:</label>
        <input type="email" class="email" value="${email}" disabled>
      </div>
      <div class="field">
        <label>Username:</label>
        <input type="text" class="username" value="${username}" disabled>
      </div>
      <button class="edit-button">Edit</button>
      <button class="save-button">Save</button>
      <p class="error-message"></p>
      <div class="saving loader hidden">
        <p>Saving user information...</p>
      </div>
    </div>
  `;

    const saveButton = this.#_shadowRoot.querySelector(".save-button");
    saveButton.addEventListener("click", () => {
      this.saveUserInformation();
    });
  }

  connectedCallback() {
    this.fetchUserInformation();
  }
}

customElements.define("user-profile", UserProfile);

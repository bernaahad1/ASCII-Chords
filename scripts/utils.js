export function onLogIn() {
  location.hash = "#chords";
  document.getElementById("logout-nav").style.display =
    document.getElementById("authentication-nav").style.display;
  document.getElementById("authentication-nav").style.display = "none";
}

export function onLogOut() {
  document.getElementById("authentication-nav").style.display =
    document.getElementById("logout-nav").style.display;
  document.getElementById("logout-nav").style.display = "none";
}

export function checkSession() {
  fetch("../php/authentication/startSession.php", { method: "GET" })
    .then((response) => response.json())
    .then((response) => {
      if (response.logged) {
        console.log("Has session", response.logged);
        onLogIn();

        if (!location.hash) {
          location.hash = "#chords";
        }
      } else {
        onLogOut();
      }
    })
    .catch(() => {
      console.log("home");
      onLogOut();

      if (!location.hash) {
        location.hash = "#home";
      }
    });
}

export function renderModalAlert(message, buttonText, onButtonPress) {
  const modalElement = document.createElement("modal-alert");
  modalElement.innerHTML = `
  <style>
  p {
    margin-bottom: 20px;
    font-size: 28px;
  }

  button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 22px;
    cursor: pointer;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  <div>
    <p>${message}</p>
    <button>${buttonText}</button>
  </div>
    `;

  document.body.appendChild(modalElement);

  modalElement.querySelector("button").addEventListener("click", () => {
    onButtonPress();
    modalElement.remove();
  });
}

function createAudioPlaying(notes) {
  for (let key of Object.keys(notes)) {
    let note = new Audio();
    let src = document.createElement("source");
    src.type = "audio/mpeg";
    src.src = "../assets/" + key + ".mp3";
    note.appendChild(src);
    notes[key] = note;
  }

  return notes;
}

const notes = {
  A: undefined,
  "A%23": undefined,
  Ab: undefined,
  B: undefined,
  "B%23": undefined,
  Bb: undefined,
  C: undefined,
  "C%23": undefined,
  Cb: undefined,
  D: undefined,
  "D%23": undefined,
  Db: undefined,
  E: undefined,
  "E%23": undefined,
  Eb: undefined,
  F: undefined,
  "F%23": undefined,
  Fb: undefined,
  G: undefined,
  "G%23": undefined,
  Gb: undefined
};

export const AUDIOS = createAudioPlaying(notes);

import { onLogIn, onLogOut } from "./utils.js";

const toggleTabs = (event) => {
  event.preventDefault();
  console.log("aloo");
  var tabs = document.querySelector(".navbar .tabs");
  tabs.classList.toggle("show");
};

document.querySelector(".navbar .icon").addEventListener("click", toggleTabs);

function getContent(fragmentId, callback) {
  let pages = {
    home: "This is the Home page. Welcome to my site.",
    chords: "<chord-list-component></chord-list-component>",
    import: "Imports go here",
    favourites: "Favourites section",
    login: `<login-form-component></login-form-component>`,
    signup: `<registration-form-component></registration-form-component>`,
    logout: "Logged out"
  };

  callback(pages[fragmentId]);
}

function loadContent() {
  const contentDiv = document.getElementById("app");
  const fragmentId = location.hash.split("#")[1] || "home";

  // TODO fix logout
  if (fragmentId == "logout") {
    fetch("../php/authentication/logout.php", { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          // document.location.reload();
          location.hash = "#chords";

          onLogOut();
        }
      })
      .catch(() => {
        console.log("Error");
        location.hash = "#chords";
      });

    return;
  }

  getContent(fragmentId, function (content) {
    contentDiv.innerHTML = content;
  });
}

function checkSession() {
  fetch("../php/authentication/startSession.php", { method: "GET" })
    .then((response) => response.json())
    .then((response) => {
      if (response.logged) {
        console.log("chords", response.logged);
        onLogIn();

        if (!location.hash) {
          location.hash = "#chords";
        }
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

checkSession();

loadContent();

window.addEventListener("hashchange", loadContent);

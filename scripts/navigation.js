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
    chords: "This is for the chords",
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

  if (fragmentId == "logout") {
    fetch("../php/logout.php", { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          document.location.reload();
          onLogOut();
        }
      })
      .catch(() => {
        console.log("Error");
      });

    return;
  }

  getContent(fragmentId, function (content) {
    contentDiv.innerHTML = content;
  });
}

function checkSession() {
  fetch("../php/startSession.php", { method: "GET" })
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

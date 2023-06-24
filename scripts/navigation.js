import { onLogOut, checkSession } from "./utils.js";

function getContent(fragmentId, callback) {
  const pages = {
    home: "<home-container></home-container>",
    chords: "<chord-list-component></chord-list-component>",
    createMelody: "<create-melody-component></create-melody-component>",
    import: "<import-component></import-component>",
    favorites: "<favorites-list-component></favorites-list-component>",
    login: `<login-form-component></login-form-component>`,
    signup: `<registration-form-component></registration-form-component>`,
    userProfile: `<user-profile></user-profile>`,
    logout: "Logged out"
  };

  callback(pages[fragmentId]);
}

function loadContent() {
  const contentDiv = document.getElementById("app");
  const fragmentId = location.hash.split("#")[1] || "home";

  if (fragmentId == "logout") {
    fetch("../php/authentication/logout.php", { method: "GET" })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          location.hash = "#chords";
          onLogOut();
        }
      })
      .catch((err) => {
        console.log(err);
        location.hash = "#chords";
      });

    return;
  }

  getContent(fragmentId, function (content) {
    contentDiv.innerHTML = content;
  });
}

checkSession();

loadContent();

window.addEventListener("hashchange", loadContent);

const navMenu = document.querySelector(".menu");
const checkBox = document.querySelector("#checkbox_toggle");

navMenu.addEventListener("mouseleave", function (event) {
  const { y } = event;
  const { top, height } = navMenu.getBoundingClientRect();
  const bottom = top + height;

  if (y > bottom) {
    checkBox.checked = false;
    checkBox.checked = false;
  }
});

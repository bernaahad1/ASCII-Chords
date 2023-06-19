import { onLogIn, onLogOut, checkSession } from "./utils.js";

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
    favorites: "<favorites-list-component></favorites-list-component>",
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

checkSession();

loadContent();

window.addEventListener("hashchange", loadContent);

// Refactor maybe
const $nav = document.querySelector(".navbar");
const threshold = $nav.getBoundingClientRect();
const fixedClass = "nav--fixed";

// reference for update request
let updating = false;
const handleScroll = () => {
  if (window.scrollY >= threshold.top || window.pageYOffset >= threshold.top)
    $nav.classList.add(fixedClass);
  else $nav.classList.remove(fixedClass);
  updating = false;
};
// on scroll, if an update opportunity is available, update
window.onscroll = () => {
  if (updating) return;
  else {
    updating = true;
    requestAnimationFrame(handleScroll);
  }
};

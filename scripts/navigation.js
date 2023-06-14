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
    signup: `<registration-form-component></registration-form-component>`
  };

  callback(pages[fragmentId]);
}

function loadContent() {
  let contentDiv = document.getElementById("app");
  fragmentId = location.hash.split("#")[1] || "home";

  getContent(fragmentId, function (content) {
    contentDiv.innerHTML = content;
  });
}

// fetch("../php/startSession.php", { method: "GET" })
//   .then((response) => response.json())
//   .then((response) => {
//     if (response.logged) {
//       console.log("chords",response.logged);

//       location.hash = "#chords";
//     } else {
//       console.log("home",response.logged);

//       location.hash = "#home";
//     }
//   })
//   .catch(() => {
//     location.hash = "#home";
//   });

if (!location.hash) {
  location.hash = "#home";
}

loadContent();

window.addEventListener("hashchange", loadContent);

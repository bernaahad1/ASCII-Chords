export function onLogIn() {
  document.getElementById("authentication-nav").style.display = "none";
  document.getElementById("logout-nav").style.display = "block";
}

export function onLogOut() {
  document.getElementById("authentication-nav").style.display = "block";
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

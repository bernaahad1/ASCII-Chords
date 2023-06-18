export function onLogIn() {
  document.getElementById("authentication-nav").style.display = "none";
  location.hash = "#chords";
  document.getElementById("logout-nav").style.display = "block";
}

export function onLogOut() {
  document.getElementById("authentication-nav").style.display = "block";
  document.getElementById("logout-nav").style.display = "none";
}

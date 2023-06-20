const showSingleChordData = (chordId) => {
  fetch("../php/chords/chord_endpoints_helper.php?id=" + chordId)
    .then((response) => response.json())
    .then((chord) => {
      const container = document.getElementById("chord-info");

      const chordInfoElement = document.createElement("div");
      chordInfoElement.setAttribute("id", "div" + chordId);
      chordInfoElement.innerHTML = `<span> Name: ${chord.name} </span>
                                         <span> Description: ${chord.description} </span>`;

      container.appendChild(chordInfoElement);
    });
};

function createAudioPlaying(notes) {
  for (key of Object.keys(notes)) {
    let note = new Audio();
    let src = document.createElement("source");
    src.type = "audio/mpeg";
    src.src = "../assets/" + key + ".mp3";
    note.appendChild(src);
    notes[key] = note;
  }

  return notes;
}

function getAudioForNotes() {
  const notes = {
    A: new Audio(),
    "A%23": new Audio(),
    Ab: new Audio(),
    B: new Audio(),
    Bb: new Audio(),
    C: new Audio(),
    "C%23": new Audio(),
    D: new Audio(),
    Db: new Audio(),
    "D%23": new Audio(),
    E: new Audio(),
    Eb: new Audio(),
    F: new Audio(),
    "F%23": new Audio(),
    G: new Audio(),
    "G%23": new Audio(),
    Gb: new Audio()
  };

  return createAudioPlaying(notes);
}

function playChords(chord) {
  document
    .getElementById("button-play" + chord.id)
    .addEventListener("click", () => {
      chord_notes = chord.description.split("-");

      notes = getAudioForNotes();

      for (let i = 0; i < chord_notes.length; i++) {
        chord_notes[i] = chord_notes[i].replace("#", "%23");
        notes[chord_notes[i]].play();
      }
    });
}

melody = [];
async function addToMelody(chord) {
  document
    .getElementById("button-to-melody" + chord.id)
    .addEventListener("click", () => {
      melody.push(chord);
      console.log(melody);

      const container = document.getElementById("melody-info");

      const chordExportToASCIIButton = document.createElement("button");
      number = melody.length - 1;
      chordExportToASCIIButton.setAttribute("id", "button-chord" + number);
      chordExportToASCIIButton.innerHTML =
        melody[melody.length - 1].name + " -";
      container.appendChild(chordExportToASCIIButton);

      removeChordFromMelody(melody.length - 1);
    });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playMelody() {
  for (let i = 0; i < melody.length; i++) {
    if (melody[i] != null) {
      chord_notes = melody[i].description.split("-");

      notes = getAudioForNotes();

        await delay(1100);

      for (let j = 0; j < chord_notes.length; j++) {
        chord_notes[j] = chord_notes[j].replace("#", "%23");
        notes[chord_notes[j]].play();
      }
    }
  }
}

function removeChordFromMelody(index) {
  if (document.getElementById("button-chord" + index) != null) {
    document
      .getElementById("button-chord" + index)
      .addEventListener("click", () => {
        document.getElementById("button-chord" + index).remove();
        melody[index] = null;
      });
  }
}

document.getElementById("play_melody").addEventListener("click", playMelody);

function exportChordToCSV(chord) {
  document
    .getElementById("button-csv" + chord.id)
    .addEventListener("click", () => {
      let csvExportElement = document.createElement("a");
      csvExportElement.setAttribute(
        "href",
        "data:text/csv;charset=utf-8, " +
          encodeURIComponent(chord.name) +
          "," +
          encodeURIComponent(chord.description)
      );
      csvExportElement.setAttribute("download", chord.name);

      document.body.appendChild(csvExportElement);

      csvExportElement.click();
      document.body.removeChild(csvExportElement);
    });
}

function exportChordToASCII(chord) {
  document
    .getElementById("button-ascii" + chord.id)
    .addEventListener("click", () => {
      let asciiExportElement = document.createElement("a");
      asciiExportElement.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
          encodeURIComponent(chord.name) +
          "|" +
          encodeURIComponent(chord.description)
      );
      asciiExportElement.setAttribute("download", chord.name);

      document.body.appendChild(asciiExportElement);

      asciiExportElement.click();
      document.body.removeChild(asciiExportElement);
    });
}

function exportChordToJSON(chord) {
  document
    .getElementById("button-json" + chord.id)
    .addEventListener("click", () => {
      let JSONExportElement = document.createElement("a");
      JSONExportElement.setAttribute(
        "href",
        "data:text/json;charset=utf-8," +
          encodeURIComponent(
            JSON.stringify({ name: chord.name, description: chord.description })
          )
      );
      JSONExportElement.setAttribute("download", chord.name + ".json");

      document.body.appendChild(JSONExportElement);

      JSONExportElement.click();
      document.body.removeChild(JSONExportElement);
    });
}

const showAllChordsData = () => {
  fetch("../php/chords/chord_endpoints_helper.php")
    .then((response) => response.json())
    .then((chord) => {
      for (let i = 0; i < chord.length; i++) {
        const container = document.getElementById("chord-info");

        const chordInfoElement = document.createElement("div");
        chordInfoElement.setAttribute("id", "div" + chord[i].id);
        chordInfoElement.innerHTML = `<span> Name: ${chord[i].name} </span>
                                        <span> Description: ${chord[i].description} </span>`;

        const chordPlayButton = document.createElement("button");
        chordPlayButton.setAttribute("id", "button-play" + chord[i].id);
        chordPlayButton.innerHTML = "Чуй акорда!";

        const chordExportToCSVButton = document.createElement("button");
        chordExportToCSVButton.setAttribute("id", "button-csv" + chord[i].id);
        chordExportToCSVButton.innerHTML = "Експортирай до CSV!";

        const chordExportToASCIIButton = document.createElement("button");
        chordExportToASCIIButton.setAttribute(
          "id",
          "button-ascii" + chord[i].id
        );
        chordExportToASCIIButton.innerHTML = "Експортирай до ASCII!";

        const chordExportToJSONButton = document.createElement("button");
        chordExportToJSONButton.setAttribute("id", "button-json" + chord[i].id);
        chordExportToJSONButton.innerHTML = "Експортирай до JSON!";

        const addToMelodyButton = document.createElement("button");
        addToMelodyButton.setAttribute("id", "button-to-melody" + chord[i].id);
        addToMelodyButton.innerHTML = "+";

        container.appendChild(chordInfoElement);
        container.appendChild(chordPlayButton);
        container.appendChild(chordExportToCSVButton);
        container.appendChild(chordExportToASCIIButton);
        container.appendChild(chordExportToJSONButton);
        container.appendChild(addToMelodyButton);

        playChords(chord[i]);
        exportChordToCSV(chord[i]);
        exportChordToASCII(chord[i]);
        exportChordToJSON(chord[i]);
        addToMelody(chord[i]);
      }
    });
};

showAllChordsData();

document.getElementById("export-melody-csv").addEventListener("click", () => {
  let csvExportElement = document.createElement("a");

  InfoForExport = "";
  for (let i = 0; i < melody.length; i++) {
    if (melody[i] != null) {
      InfoForExport +=
        encodeURIComponent(melody[i].name) +
        "," +
        encodeURIComponent(melody[i].description) +
        "\n";
    }
  }

  csvExportElement.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + InfoForExport
  );
  csvExportElement.setAttribute("download", "name");

  document.body.appendChild(csvExportElement);

  csvExportElement.click();
  document.body.removeChild(csvExportElement);
});

document.getElementById("export-melody-ascii").addEventListener("click", () => {
  let csvExportElement = document.createElement("a");

  InfoForExport = "";
  for (let i = 0; i < melody.length; i++) {
    if (melody[i] != null) {
      InfoForExport +=
        encodeURIComponent(melody[i].name) +
        "|" +
        encodeURIComponent(melody[i].description) +
        "\n";
    }
  }

  csvExportElement.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + InfoForExport
  );
  csvExportElement.setAttribute("download", "name");

  document.body.appendChild(csvExportElement);

  csvExportElement.click();
  document.body.removeChild(csvExportElement);
});

document.getElementById("export-melody-json").addEventListener("click", () => {
  let csvExportElement = document.createElement("a");

  InfoForExport = "";
  for (let i = 0; i < melody.length; i++) {
    if (melody[i] != null) {
      InfoForExport += encodeURIComponent(
        JSON.stringify({
          name: melody[i].name,
          description: melody[i].description
        })
      );
    }
  }

  csvExportElement.setAttribute(
    "href",
    "data:text/json;charset=utf-8," + InfoForExport
  );
  csvExportElement.setAttribute("download", "name" + ".json");

  document.body.appendChild(csvExportElement);

  csvExportElement.click();
  document.body.removeChild(csvExportElement);
});

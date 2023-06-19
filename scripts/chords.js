const showSingleChordData = chordId => {
    fetch('../php/chords/chord_endpoints_helper.php?id=' + chordId)
        .then(response => response.json())
        .then(chord => {

            const container = document.getElementById('chord-info');

            const chordInfoElement = document.createElement('div');
            chordInfoElement.setAttribute("id", "div"  + chordId);
            chordInfoElement.innerHTML = `<span> Name: ${chord.name} </span>
                                         <span> Description: ${chord.description} </span>`;

            container.appendChild(chordInfoElement);
        });
}

function createAudioPlaying(notes) {
    for (key of Object.keys(notes)) {
        let note = new Audio();
        let src = document.createElement("source");
        src.type = "audio/mpeg";
        src.src = '../assets/' + key + '.mp3';
        note.appendChild(src);
        notes[key] = note;
    }

    return notes;
}

function getAudioForNotes() {
    const notes = {
        'A': new Audio(),
        'A%23': new Audio(),
        'Ab': new Audio(),
        'B': new Audio(),
        'Bb': new Audio(),
        'C': new Audio(),
        'C%23': new Audio(),
        'D': new Audio(),
        'Db': new Audio(),
        'D%23': new Audio(),
        'E': new Audio(),
        'Eb': new Audio(),
        'F': new Audio(),
        'F%23': new Audio(),
        'G': new Audio(),
        'G%23': new Audio(),    
        'Gb': new Audio(), 
    }

    return createAudioPlaying(notes);
}

function playChords(chord) {
    
    document.getElementById("button-play"  + chord.id).addEventListener('click', () => {
        chord_notes = chord.description.split("-");
        
        notes = getAudioForNotes();

        for (let i = 0; i < chord_notes.length; i++) {
            chord_notes[i] = chord_notes[i].replace('#', '%23');
            notes[chord_notes[i]].play();
            notes[chord_notes[i]].play();
            notes[chord_notes[i]].play();
        }
    });  
}

 melody = [];
 async function addToMelody(chord) {
    document.getElementById("button-to-melody"  + chord.id).addEventListener('click', () => {
        melody.push(chord);
        console.log(melody);

        const container = document.getElementById('melody-info');
       
        const chordExportToASCIIButton = document.createElement('button');
        number =  melody.length - 1;
        chordExportToASCIIButton.setAttribute("id", "button-chord"  + number);
        chordExportToASCIIButton.innerHTML = melody[melody.length - 1].name + ' -';
        container.appendChild(chordExportToASCIIButton);
        
        removeChordFromMelody();
    });  
 }

 function delay(millisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
    })
}

 async function playMelody() {
    for (chord of melody) {
        chord_notes = chord.description.split("-");
    
        notes = getAudioForNotes();
        await delay(2000);
        
        for (let i = 0; i < chord_notes.length; i++) {
            chord_notes[i] = chord_notes[i].replace('#', '%23');
            notes[chord_notes[i]].play();
            notes[chord_notes[i]].play();
            notes[chord_notes[i]].play();
        }
    }
   
 }
   
function removeChordFromMelody() {
    for (let i = 0; i < melody.length; i++) {
        document.getElementById("button-chord" + i).addEventListener('click', () => {
            document.getElementById("button-chord" + i).remove();
            melody.splice(i, 1);
        });  
    }
}

 document.getElementById("play_melody").addEventListener('click', playMelody);

 function exportChordToCSV(chord) {
    document.getElementById("button-csv"  + chord.id).addEventListener('click', () => {
        var csvExportElement = document.createElement('a');
        csvExportElement.setAttribute('href', 'data:text/csv;charset=utf-8, '+ encodeURIComponent(chord.name) + "," + encodeURIComponent(chord.description));
        csvExportElement.setAttribute('download', chord.name);
       
        document.body.appendChild(csvExportElement);
        
        csvExportElement.click();
        document.body.removeChild(csvExportElement);
    });  
}

function exportChordToASCII(chord) {
    document.getElementById("button-ascii"  + chord.id).addEventListener('click', () => {
        var asciiExportElement = document.createElement('a');
        asciiExportElement.setAttribute('href', 'data:text/plain;charset=utf-8,'+ encodeURIComponent(chord.name) + " " + encodeURIComponent(chord.description));
        asciiExportElement.setAttribute('download', chord.name);
       
        document.body.appendChild(asciiExportElement);
        
        asciiExportElement.click();
        document.body.removeChild(asciiExportElement);
    });  
 }

 const showAllChordsData = () => {
    fetch('../php/chords/chord_endpoints_helper.php')
        .then(response => response.json())
        .then(chord => {
            for (let i = 0; i < chord.length; i++) {
        
            const container = document.getElementById('chord-info');

            const chordInfoElement = document.createElement('div');
            chordInfoElement.setAttribute("id", "div"  + chord[i].id);
            chordInfoElement.innerHTML = `<span> Name: ${chord[i].name} </span>
                                        <span> Description: ${chord[i].description} </span>`;
                            
            const chordPlayButton = document.createElement('button');
            chordPlayButton.setAttribute("id", "button-play"  + chord[i].id);
            chordPlayButton.innerHTML = 'Чуй акорда!';

            const chordExportToCSVButton = document.createElement('button');
            chordExportToCSVButton.setAttribute("id", "button-csv"  + chord[i].id);
            chordExportToCSVButton.innerHTML = 'Експортирай до CSV!';

            const chordExportToASCIIButton = document.createElement('button');
            chordExportToASCIIButton.setAttribute("id", "button-ascii"  + chord[i].id);
            chordExportToASCIIButton.innerHTML = 'Експортирай до ASCII!';

            const addToMelodyButton = document.createElement('button');
            addToMelodyButton.setAttribute("id", "button-to-melody"  + chord[i].id);
            addToMelodyButton.innerHTML = '+';
            
            container.appendChild(chordInfoElement);
            container.appendChild(chordPlayButton);
            container.appendChild(chordExportToCSVButton);
            container.appendChild(chordExportToASCIIButton);
            container.appendChild(addToMelodyButton);
            
            playChords(chord[i]);
            exportChordToCSV(chord[i]);
            exportChordToASCII(chord[i]);
            addToMelody(chord[i]);
        }
    });
}

showAllChordsData();

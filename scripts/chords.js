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
            
            container.appendChild(chordInfoElement);
            container.appendChild(chordPlayButton);
            container.appendChild(chordExportToCSVButton);
            
            playChords(chord[i]);
            exportChordToCSV(chord[i]);
        }
    });
}

function playChords(chord) {
    
    document.getElementById("button-play"  + chord.id).addEventListener('click', () => {
        chord_notes = chord.description.split("-");
        console.log(chord_notes);
        
        for (let i = 0; i < chord_notes.length; i++) {
            chord_notes[i] = chord_notes[i].replace('#', '%23');
        }

        var snd1  = new Audio();
        var src1  = document.createElement("source");
        src1.type = "audio/mpeg";
        src1.src  = '../assets/' + chord_notes[0] + '.mp3';
        snd1.appendChild(src1);
        
        var snd2  = new Audio();
        var src2  = document.createElement("source");
        src2.type = "audio/mpeg";
        src2.src  = '../assets/' + chord_notes[1] + '.mp3';
        snd2.appendChild(src2);

        var snd3  = new Audio();
        var src3  = document.createElement("source");
        src3.type = "audio/mpeg";
        src3.src  = '../assets/' + chord_notes[2] + '.mp3';
        snd3.appendChild(src3);
        
        snd1.play(); 
        snd2.play(); 
        snd3.play();
    });  
}

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

showAllChordsData();
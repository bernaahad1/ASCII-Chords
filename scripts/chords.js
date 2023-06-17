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

            container.appendChild(chordInfoElement);
            }
        });
}

showAllChordsData();
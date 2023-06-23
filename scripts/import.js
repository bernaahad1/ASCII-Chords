window.onload = function(event) {
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}

async function handleFileSelect(event) {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = (event) => {
    let fileAsText = event.target.result;
    let fileLines = fileAsText.split(/[\r\n]+/g);     

        console.log(fileAsText);
        console.log(fileLines);

    let fileExtension = file.name.split('.').pop();
    
    if (fileExtension.toLowerCase() === 'txt') {
        const importTxt = () => {
            postTXTFile('../php/import/ImportEndpoints.php?txt_file_path=' + fileLines);
        }
        document.getElementById("import").addEventListener('click', importTxt);
    } else
        if (fileExtension.toLowerCase() === 'csv') {
            const importCSV = () => {
                postCSVFile('../php/import/ImportEndpoints.php?csv_file_path=' + fileLines);
            }
            document.getElementById("import").addEventListener('click', importCSV); 
        } else {
            const importJSON = () => {
                postFile('../php/import/ImportEndpoints.php?json_file_path=' + fileLines);
            }
            document.getElementById("import").addEventListener('click', importJSON);
        }
    
    }
};


const postTXTFile = async (url) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'text/plain charset=UTF-8',
        }
    })
}

const postCSVFile = async (url) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'text/csv charset=UTF-8',
        }
    })
}





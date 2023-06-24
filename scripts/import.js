window.onload = function(event) {
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}

async function handleFileSelect(event) {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = (event) => {
    let fileAsText = event.target.result;

    fileAsText = fileAsText.replaceAll("#", "%23");

    let fileExtension = file.name.split('.').pop();

    if (fileExtension.toLowerCase() === 'txt') {
        importTXT(fileAsText);
    } else {
        if (fileExtension.toLowerCase() === 'csv') {
            importCSV(fileAsText);
        } else {
            importJSON(fileAsText);   
            }
        }
    };
}

function importTXT(fileAsText) {
    let fileLines = fileAsText.split(/[\r\n]+/g);     

        const postFunction = () => {
            postFile('../php/import/ImportEndpoints.php?txt_file_path=' + fileLines);
        }
        document.getElementById("import").addEventListener('click', postFunction);
}

function importCSV(fileAsText) {
    const string_after_splitting = fileAsText.split(',');
    const fileAsText1 = string_after_splitting.join(';');
    let fileLines = fileAsText1.split(/[\r\n]+/g);     
    
    const postFunction = () => {
        postFile('../php/import/ImportEndpoints.php?csv_file_path=' + fileLines);
    }
    document.getElementById("import").addEventListener('click', postFunction); 
}

function importJSON(fileAsText) {
    let temp = "";
    let jsonAsArray = [];
    for (let i = 0; i < fileAsText.length; i++)
    {
        temp += fileAsText[i];
        if (fileAsText[i] == "}")
        {
            jsonAsArray.push(JSON.parse(temp));
            temp = "";
        }
    }

    const postFunction = () => {
        postFile('../php/import/ImportEndpoints.php?json_file_path=' + JSON.stringify(jsonAsArray));
    }
    document.getElementById("import").addEventListener('click', postFunction);
}

const postFile = async (url) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'text/plain charset=UTF-8',
        }
    })
}

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
        let fileLines = fileAsText.split(/[\r\n]+/g);     

        const importTxt = () => {
            postFile('../php/import/ImportEndpoints.php?txt_file_path=' + fileLines);
        }
        document.getElementById("import").addEventListener('click', importTxt);
    } else

        if (fileExtension.toLowerCase() === 'csv') {
            const string_after_splitting = fileAsText.split(',');
            const fileAsText1 = string_after_splitting.join(';');
            let fileLines = fileAsText1.split(/[\r\n]+/g);     
            
            const importCSV = () => {
                postFile('../php/import/ImportEndpoints.php?csv_file_path=' + fileLines);
            }
            document.getElementById("import").addEventListener('click', importCSV); 
        } else {

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

            const importJSON = () => {
                postFile('../php/import/ImportEndpoints.php?json_file_path=' + JSON.stringify(jsonAsArray));
            }
            document.getElementById("import").addEventListener('click', importJSON);
        }
    
    }
};


const postFile = async (url) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'text/plain charset=UTF-8',
        }
    })
}


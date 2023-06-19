
const post = async (url) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })

    const data = await response.json()

    return data
}


const func = () => {
    post('../php/import/ImportEndpoints.php?csv_file_path=D:/Programs/Xampp/htdocs/ASCII-Chords/scripts/test.csv').then(data => console.log(data))
}

document.getElementById("import").addEventListener('click', func);
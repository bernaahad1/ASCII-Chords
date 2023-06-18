const post = async (url, params) => {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })

    const data = await response.json()

    return data
}


const func = () => {
    post('../php/import/ImportEndpoints.php', {
        csv_file_path: "test.csv"
    }).then(data => console.log(data))
}

document.getElementById("import").addEventListener('click', func);
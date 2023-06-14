fetch('../php/startSession.php', {method: 'GET'})
    .then(response=>response.json())
    .then(response => {
        if (response.logged) {
            document.getElementById('login_message').innerText = "Hello, " + response.email;
            document.getElementById('logout').classList.add('show');
        } else {
            document.getElementById('login').classList.add('show');
        }
    });
    

document.getElementById('login_form').addEventListener('submit', event => {
    
    event.preventDefault();
    
    const loginForm = document.getElementById('login_form');
    
    const loginFormInput = {
        email: loginForm.querySelector("#login_form input[name='email']").value,
        password: loginForm.querySelector("#login_form input[name='password']").value,
    };
    
    if (loginFormInput.email == "") {
        document.getElementById('login_message').innerText = "Попълнeте имейл!";
        return;
    }

    if (loginFormInput.password == "") {
        document.getElementById('login_message').innerText = "Попълнете парола!";
        return;
    }

    fetch('../php/login.php', {
        method: 'POST',
        body: JSON.stringify(loginFormInput),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            document.getElementById('login_message').innerText = "Добре дошъл, " + response.email;
            document.getElementById('login').remove();
            document.getElementById('logout').classList.add('show');
        } else {
            document.getElementById('login_message').innerText = "Имейлът и паролата не съвпадат!";
        }
    });
});

document.getElementById('logout').addEventListener('click', () => {
    fetch('../php/logout.php', {method: 'GET'})
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            document.location.reload();
        }
    });
});

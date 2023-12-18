const baseUrl = 'https://b1messenger.imatrythis.com/';
const content = document.querySelector('.content');

let userCourrant = null;
let token = '';

async function render(pageContent) {
    content.innerHTML = '';
    content.innerHTML = pageContent;
}

async function fetchAndRenderMessages() {
    try {
        const messages = await fetchMessages();
        renderMessages(messages);
    } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
    }
}

function run() {
    if (!token) {
        return registerForm();
    } else {
        fetchAndRenderMessages();
    }
}

function registerForm() {
    let templateRegisterForm = `<div class="container mt-5">
        <form id="registerForm" class="m-3">
            <label for="username" class="form-label">Nom d'utilisateur:</label>
            <input type="text" id="username" name="username" class="form-control" required>
            
            <label for="password" class="form-label">Mot de passe:</label>
            <input type="password" id="password" name="password" class="form-control" required>

            <div class="mt-3">
                <button type="button" onclick="register()" class="btn btn-primary">S'inscrire</button>
                <p class="d-inline ml-2"> <button onclick="loginForm()" class="btn btn-link">Se connecter</button></p>
            </div>
        </form>
    </div>`;

    render(templateRegisterForm);
}

async function postDataRegister(url = '', donnees = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(donnees),
    });
    return response.json();
}

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await postDataRegister(baseUrl + 'register', { username, password });
        console.log(response);
        // Effectuer d'autres actions si nécessaire après l'inscription
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
    }
}

function loginForm() {
    let templateLoginForm = `<div class="container mt-5">
        <form id="loginForm" class="m-3 container">
            <label for="username" class="form-label">Nom d'utilisateur:</label>
            <input type="text" id="username" name="username" class="form-control" required>

            <label for="password" class="form-label">Mot de passe:</label>
            <input type="password" id="password" name="password" class="form-control" required>

            <div class="mt-3">
                <button type="button" onclick="login()" class="btn btn-primary">Se connecter</button>
                <p class="d-inline ml-2"> <button onclick="registerForm()" class="btn btn-link">S'inscrire</button></p>
            </div>
        </form>
    </div>`;

    render(templateLoginForm);
}

async function postDataLogin(url = '', donnees = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(donnees),
    });
    return response.json();
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await postDataLogin(baseUrl + 'login', { username, password });
        console.log(response);
        if (response.token) {
            token = response.token;
            fetchAndRenderMessages();
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
    }
}

function renderMessages(messages) {
    let messagesHtml = messages.map(message => {
        const author = message.author.username || 'Anonyme';
        return `<p><strong>${author} :</strong> ${message.content}</p>`;
    }).join('');

    let templateMessages = `<div class="container mt-5">${messagesHtml}</div>`;
    render(templateMessages);
}

async function fetchMessages() {
    const response = await fetch(baseUrl + 'api/messages', {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || "Erreur lors de la récupération des messages");
    }
}


run();





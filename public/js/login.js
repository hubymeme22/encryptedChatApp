import { login } from "./modules/expanded.js";

const buttons = document.getElementsByTagName('button');
const inputBoxes = document.getElementsByTagName('input');

const loginButton = buttons.item(0);
const signupButton = buttons.item(1);

const userInput = inputBoxes.item(0);
const passInput = inputBoxes.item(1);

// for displaying message when logging in
function displayMessage(message='', type=0) {
    const msgParagraph = document.getElementById('loginMessage');
    switch (type) {
        case 0:
            msgParagraph.style.color = 'green';
            break;
        case 1:
            msgParagraph.style.color = 'orange';
            break;
        case 2:
            msgParagraph.style.color = 'red';
            break;
        default:
            msgParagraph.style.color = 'gray';
    }

    // apply the message
    msgParagraph.innerText = message;
}

loginButton.onclick = () => {
    // retrieve the username and password
    const credentials = {
        'username': userInput.value,
        'password': passInput.value
    };

    // callback when accepted
    const accepted = (jsonData) => {
        console.log(jsonData);
        if (!jsonData.existing) {
            displayMessage('Invalid Account', 2);
            return;
        }

        // save the token and user info
        displayMessage('Logged in');
        window.localStorage.setItem('token', jsonData.token);
        window.localStorage.setItem('raw-data', jsonData.data);

        // use the token as cookie
        setTimeout(() => {
            document.cookie = `token=${jsonData.token}; path=/`;
        }, 500);
    };

    // callback when rejected
    const rejected = (error) => {
        displayMessage('Server Error', 2);
    };

    displayMessage('Logging in...', 3);
    login(credentials, accepted, rejected);
};

signupButton.onclick = () => {
    window.location.href = '/signup.html';
};

passInput.addEventListener('input', (evt) => {
    const errMessage = document.getElementById('loginMessage');
    console.log('Fuck u');

    if (passInput.innerText == '' && errMessage.value != '')
        errMessage.innerText = '';
});
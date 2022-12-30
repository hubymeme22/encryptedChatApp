import { login } from "./modules/expanded.js";

const buttons = document.getElementsByTagName('button');

const loginButton = buttons.item(0);
const signupButton = buttons.item(1);


loginButton.onclick = () => {

    // retrieve the username and password
    const inputBoxes = document.getElementsByTagName('input');
    const userInput = inputBoxes.item(0);
    const passInput = inputBoxes.item(1);

    const credentials = {
        'username': userInput.value,
        'password': passInput.value
    };

    // callback when accepted
    const accepted = (jsonData) => {
        // interpret the jsonData recieved
        // use the token as cookie.
    };

    // callback when rejected
    const rejected = (error) => {
        // interpret error
        // display the error message
    };

    login(credentials, accepted, rejected);
};

signupButton.onclick = () => {
    window.location.href = '/signup.html';
};
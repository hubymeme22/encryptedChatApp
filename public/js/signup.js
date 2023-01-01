import { login, signup } from "./modules/expanded.js";


// for displaying error/warning message
// types (changes the font color):
//   0 - message
//   1 - warning
//   2 - error
function displayMessage(message='', type=0) {
    const msgParagraph = document.getElementById('signupMessage');
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

// retrieves the accounts inputted by the user
function getAccountDetails() {
    const inputBoxes = document.getElementsByTagName('input');
    const username = inputBoxes.item(0);
    const name = inputBoxes.item(1);
    const key = inputBoxes.item(2);
    const password = inputBoxes.item(3);

    return {
        'username': username.value,
        'name': name.value,
        'key': key.value,
        'password': password.value
    };
}

const signupButton = document.getElementsByTagName('button')[0];
signupButton.onclick = () => {
    const credentials = getAccountDetails();
    const accept = (jsonData) => {
        // checks jsonData response
        // logs in the account and redirect to landing page
        console.log(jsonData);

        // account already exists
        if (jsonData.existing) {
            displayMessage('Account Already Exist!', 1);
            return;
        }

        // account is successfully created
        if (jsonData.created) {
            displayMessage('Account Created!');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 500);
            return;
        }
    };

    const reject = (error) => {
        // displays error message
        console.log(error);
        displayMessage('Server Error occured (try again later)', 3);
    };

    displayMessage('Registering account...', 3);
    signup(credentials, accept, reject);
};
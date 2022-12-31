import { login, signup } from "./modules/expanded.js";

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
    };

    const reject = (error) => {
        // displays error message
        console.log(error);
    };

    console.log('SIGNUP!!');
    signup(credentials, accept, reject);
};
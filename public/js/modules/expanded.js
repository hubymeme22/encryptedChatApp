import { postRequest, postTokenRequest, acceptCallbackFormat, rejectCallbackFormat } from "./requests.js";

// use post request to login the username and password from the data
function login(
    data={ 'username': '', 'password': '' },
    accept=acceptCallbackFormat,
    reject=rejectCallbackFormat) {

    postRequest('/login', data, accept, reject);
}

function signup(
    data={
        'username': '',
        'name': '',
        'key': '',
        'password': '' },
    accept=acceptCallbackFormat,
    reject=rejectCallbackFormat) {

    postRequest('/signup', data, accept, reject);
}

function addContact(
    data ={ 'usernameContact': '', 'key': '1234'},
    accept=acceptCallbackFormat,
    reject=rejectCallbackFormat) {

    const token = window.localStorage.getItem('token');
    postTokenRequest('/add-contact', token, data, accept, reject);
}

export { addContact, login, signup }
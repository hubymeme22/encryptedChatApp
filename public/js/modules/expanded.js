import * as request from "./requests.js";
import { rejectCallbackFormat, acceptCallbackFormat } from "./requests.js";

// use post request to login the username and password from the data
function login(
    data={ 'username': '', 'password': '' },
    accept=acceptCallbackFormat,
    reject=rejectCallbackFormat) {

    request.postRequest('/login', data, accept, reject);
}

function signup(
    data={
        'username': '',
        'name': '',
        'key': '',
        'password': '' },
    accept=acceptCallbackFormat,
    reject=rejectCallbackFormat) {

    request.postRequest('/signup', data, accept, reject);
}

function addContact(
    data ={ 'usernameContact': '', 'key': '1234'},
    accept=acceptCallbackFormat,
    reject=rejectCallbackFormat) {

    const token = window.localStorage.getItem('token');
    request.postTokenRequest('/add-contact', token, data, accept, reject);
}

// retrieves the user's public details
function getUserDetails(username='', accept=acceptCallbackFormat, reject=rejectCallbackFormat) {
    request.getRequest('/public-details/' + username, accept, reject);
}

function getChatDetails(accept=acceptCallbackFormat, reject=rejectCallbackFormat) {
    request.getRequest('/chats-data', accept, reject);
}


export { addContact, getChatDetails, getUserDetails, login, signup }
import { postRequest, acceptCallbackFormat, rejectCallbackFormat } from "./requests.js";

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

export { login, signup }
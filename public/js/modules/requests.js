// current server to send request on
const url = window.location.origin;
const acceptCallbackFormat = (jsonData) => {};
const rejectCallbackFormat = (error) => {};

// make a normal post request to the server
function postRequest(route='/', data={}, accepted_callback=acceptCallbackFormat, reject_callback=rejectCallbackFormat) {
    fetch(url + route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)})

    .then(response => { return response.json() } )
    .then(accepted_callback)
    .catch(reject_callback);
}

// make a post request to the server with modified header "token"
// this one is used for authorization
function postTokenRequest(route='/', token='', data={}, accepted_callback=acceptCallbackFormat, reject_callback=rejectCallbackFormat) {
    fetch(url + route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'koala': token
        },
        body: JSON.stringify(data)})

    .then(response => { return response.json() } )
    .then(accepted_callback)
    .catch(reject_callback);
}

function getRequest(route='/', accepted_callback=acceptCallbackFormat, reject_callback=rejectCallbackFormat) {
    fetch(url + route)
        .then(response => response.json())
        .then(accepted_callback)
        .catch(reject_callback);
}

export {
    acceptCallbackFormat,
    getRequest,
    rejectCallbackFormat,
    postRequest,
    postTokenRequest
}
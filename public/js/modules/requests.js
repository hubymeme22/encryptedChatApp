// current server to send request on
const url = window.location.origin;
const acceptCallbackFormat = (jsonData) => {};
const rejectCallbackFormat = (error) => {};

// make a normal post request to the server
function postRequest(route='/', data={}, accepted_callback=acceptCallbackFormat, reject_callback=rejectCallbackFormat) {
    const request = fetch(url + route, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    request.then((response) => { return response.json() });
    request.then(accepted_callback);
    request.catch(reject_callback);
}

// make a post request to the server with modified header "token"
// this one is used for authorization
function postTokenRequest(route='/', token='', data={}, accepted_callback=acceptCallbackFormat, reject_callback=rejectCallbackFormat) {
    const request = fetch(url + route, {
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(data)
    });

    request.then((response) => { return response.json() });
    request.then(accepted_callback);
    request.catch(reject_callback);
}

export {
    acceptCallbackFormat,
    rejectCallbackFormat,
    postRequest,
    postTokenRequest
}
import * as cryptor from './experimental-encryption.js';

const WS_IP = 'localhost';
const WS_PORT = 8080;

const wsocketClient = new WebSocket(`ws://${WS_IP}:${WS_PORT}`);
wsocketClient.addEventListener('message', (data) => {
    console.log(data);
});

let accountUsername = null;
let accountKey = null;

// assign my username
const assignAccDetails = (username, key) => {
    accountUsername = username;
    accountKey = key;

    // for assigning username first
    wsocketClient.send(accountUsername);
};

// format the data into readable by the server
const sendMessage = (contactUsername, contactKey, message) => {
    const encryptedMessage = window.btoa(cryptor.XOR(message, contactKey));
    const firstLayerFormat  = `${contactUsername} ${encryptedMessage}`;

    const encodeFirstLayer = window.btoa(cryptor.encryptData(firstLayerFormat, accountKey));
    const secondLayerFormat = `${accountUsername} ${encodeFirstLayer}`;

    wsocketClient.send(secondLayerFormat);
};

export {
    assignAccDetails,
    sendMessage
}
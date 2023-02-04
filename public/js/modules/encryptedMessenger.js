import * as cryptor from './experimental-encryption.js';

const WS_IP = 'localhost';
const WS_PORT = 8080;

const wsocketClient = new WebSocket(`ws://${WS_IP}:${WS_PORT}`);

let accountUsername = null;
let accountKey = null;

let contactUsername = null;
let contactKey = null;

// assign my username
const assignAccDetails = (username, key) => {
    accountUsername = username;
    accountKey = key;

    // for assigning username first
    wsocketClient.send(accountUsername);
};

// assign the contact's details for messaging
const assignContactDetails = (username, key) => {
    contactUsername = username;
    contactKey = key;
};

// for decrypting my message
const decryptConMessage = (b64Message) => {
    return cryptor.XOR(window.atob(b64Message), accountKey);
};

const decryptMyMessage = (b64Message) => {
    return cryptor.XOR(window.atob(b64Message), contactKey);
};

// format the data into readable by the server
const sendMessage = (message) => {
    if (contactUsername == null || contactKey == null)
        return console.error('Cannot send message! UnassignedContactDetailsError');

    const encryptedMessage = window.btoa(cryptor.XOR(message, contactKey));
    const firstLayerFormat  = `${contactUsername} ${encryptedMessage}`;

    const encodeFirstLayer = window.btoa(cryptor.encryptData(firstLayerFormat, accountKey));
    const secondLayerFormat = `${accountUsername} ${encodeFirstLayer}`;

    wsocketClient.send(secondLayerFormat);
};

// this is a one time call function
const setOnMessage = (callback=function(data){}) => {
    wsocketClient.addEventListener('message', (msg) => {
        const decryptedRecievedData = cryptor.XOR(window.atob(msg.data), accountKey);
        console.log(`[ws message] Recieved: ${decryptedRecievedData}`);

        // call the assigned callback
        callback(decryptedRecievedData);
    });
};

export {
    assignAccDetails,
    assignContactDetails,
    decryptConMessage,
    decryptMyMessage,
    sendMessage,
    setOnMessage
}
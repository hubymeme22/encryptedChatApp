const keyHandler = require('./clientKeyHandler');
const dbConn = require('./dbConnection');

// websocket server that will act as proxy
let webSocketProxyServer = null;

// function that acts as proxy and forwards client commands
const forwardMessage = (username, contactUsername, message) => {
    if (webSocketProxyServer == null)
        return console.error('[-] Cannot forward (webSocketServer not set)');

    // updates the message on the database first before sending
    dbConn.updateMessage(username, contactUsername, message,
        function(msgData) {
            // forwards the message to the clients with specified username
            console.log(`[proxy] forward pckt: from(${username}) to(${contactUsername}) ${message}`);
            webSocketProxyServer.clients.forEach(client => {
                if (client.username == contactUsername) {
                    client.send(message);
                }
            });
        });
};

// handle client message
const handleClientMessage = (dataString) => {
    const firstLayerParse = dataString.split(' ');

    // derived details from the first layer
    const username = firstLayerParse[0];
    const secondLayerDecoded = dataString.replace(username + ' ', '');
    const secondLayerFormat = atob(secondLayerDecoded);

    // for decrypting the message from client
    const edCryptor = keyHandler.getEDCryptor(username);
    const userKey = keyHandler.getUserKey(username);

    // for decoding the second layer and retrieve data
    const secondLayerDecapsulation = edCryptor.decryptData(secondLayerFormat, userKey);
    const secondLayerDetails = secondLayerDecapsulation.split(' ');

    // derived details from the second layer
    const contactUsername = secondLayerDetails[0];
    const encryptedMessageToForward = secondLayerDetails[1];
    forwardMessage(username, contactUsername, encryptedMessageToForward);
};

// for handling websocket server
const handleServer = (webSocketServer) => {
    webSocketServer.on('connection', (wsocketClient) => {
        wsocketClient.on('message', (data) => {

            // checks if the client already has a username
            // the client MUST send its username first
            if (wsocketClient.username == null) {
                wsocketClient.username = data.toString();
                console.log(`[proxy] A client has connected: ${wsocketClient.username}`);
            }

            // finally handles the messages
            else handleClientMessage(data.toString());

        });
    });
};

const setProxyServer = (webSocketServer) => {
    webSocketProxyServer = webSocketServer;
};

module.exports = {
    setProxyServer,
    handleServer
}
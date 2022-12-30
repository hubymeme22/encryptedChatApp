const express = require('express');
const app = express();

// environment variables
require('dotenv').config();

const serverIP = process.env.IP;
const serverPort = process.env.PORT;

// middleware functionalities
app.use(express.static('public'));

app.get('/', (req, res) => {
    // checks here if there's an existing session
    // else redirect to the login page
    res.redirect('login.html');
});

// start server
app.listen(serverPort, serverIP, () => {
    console.log(`[+] Server started at http://${serverIP}:${serverPort}`);
});
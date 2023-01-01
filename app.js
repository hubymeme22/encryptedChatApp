const express = require('express');
const mongoose = require('mongoose');

const Account = require('./models/account');
const app = express();

// environment variables
require('dotenv').config();

// credentials and constants
const uri = process.env.MONGODBURI;
const serverIP = process.env.IP;
const serverPort = process.env.PORT;

// uri for database connection
// connect to database first
console.log('[*] Connecting to database...');

mongoose.set('strictQuery', false);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('[+] Database Connected!');

        // start the server when connection is successful
        app.listen(serverPort, serverIP, () => {
            console.log(`[+] Server started at http://${serverIP}:${serverPort}`);
        });
    })

    .catch((err) => {
        console.log(`[-] Error occured: ${err}`);
    });

// middleware functionalities
app.use(express.json());
app.use(express.static('public'));

////////////////////
//  GET requests  //
////////////////////
app.get('/', (req, res) => {
    // checks here if there's an existing session
    // else redirect to the login page
    res.redirect('login.html');
});


/////////////////////
//  POST requests  //
/////////////////////
app.post('/signup', (req, res) => {
    const creds = req.body;

    // validate credentials format here... pls
    // TODO: credentials value validation here

    // checks if the specified username has already been used
    Account.find({ username: creds.username })
        .then((response) => {

            // account already exists
            if (response.length > 0) {
                res.json({
                    existing: true,
                    created: false,
                    data: null,
                    error: null
                });
                return;
            }

            // creates a new account
            const newAccount = new Account({
                username: creds.username,
                password: creds.password,
                accountDetails: {
                    'name': creds.name,
                    'key': creds.key
                }
            });

            // saves the data to the database
            newAccount.save()
                .then((response) => {
                    res.json({
                        existing: false,
                        created: true,
                        data: response,
                        error: null
                    });
                })

                .catch((error) => {
                    res.json({
                        existing: false,
                        created: false,
                        data: null,
                        error: error
                    });
                });
        })

        .catch((error) => {
            res.json({
                existing: false,
                created: false,
                data: null,
                error: null
            }).status(500);
        });
});
const express = require('express');
const mongoose = require('mongoose');

const Account = require('./models/account');
const middleware = require('./middleware/validate');
const dbConn = require('./modules/dbConnection');

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
// registers the new account added by the user
app.post('/signup', middleware.validateRegister, (req, res) => {
    const creds = req.body;
    const serverError = (error) => {
        res.json({
            existing: false,
            created: false,
            data: null,
            error: null
        }).status(500);
    };

    const accountExists = (response) => {
        res.json({
            existing: true,
            created: false,
            data: null,
            error: null
        });
    }

    // registers the account if this
    // does not yet exist
    const accountDNExist = () => {
        dbConn.registerAccount({
            username: creds.username,
            password: creds.password,
            accountDetails: {
                'name': creds.name,
                'key': creds.key
            }
        }, (response) => {
            res.json({
                existing: false,
                created: true,
                data: response,
                error: null
            });
        }, (error) => {
            res.json({
                existing: false,
                created: false,
                data: null,
                error: error
            });
        })
    };

    // do the callbacks above for certain conditions
    dbConn.isUserExisting(creds.username, accountExists, accountDNExist, serverError);
});
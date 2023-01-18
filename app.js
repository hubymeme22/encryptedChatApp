const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());

////////////////////
//  GET requests  //
////////////////////
app.get('/', (req, res) => {
    // checks here if there's an existing session
    // else redirect to the login page
    res.redirect('login.html');
});

app.get('/chatroom.html', middleware.validatePagePermission, (req, res, next) => {
    next();
});

// redirectors
app.get('/chatroom', (req, res, next) => {
    res.redirect('/chatroom.html')
});

app.get('/login', (req, res) => {
    res.redirect('/login.html');
});

app.get('/signup', (req, res) => {
    res.redirect('/signup.html');
});

// gets other details of the account
app.get('/public-details/:username', (req, res) => {
    if (req.params.username == null)
        return res.json({
            existing: false,
            data: null,
            error: null
        });

    // additional details will be added here in the future
    Account.findOne({username: req.params.username}, 'username accountDetails.name')
        .then(userData => {
            res.json({
                existing: true,
                data: userData,
                error: null
            });
        })
        .catch(error => {
            res.json({
                existing: true,
                data: null,
                error: error
            });
        })
});

// retrieves all he current chat data of the
app.get('/chats-data', middleware.validatePagePermission, (req, res) => {
    const username = res.allowedData.username;
    dbConn.getUserMessages(username,
        function(msgData) {
            res.json({ message: 'yes', error: null, data: msgData});
        },
        function() {
            res.json({message: 'no', error: null, data: null});
        },
        function(error) {
            res.status(500);
            res.json({message: 'no', error: error, data: null});
        })
});

/////////////////////
//  POST requests  //
/////////////////////
// logs in the specified account
app.post('/login', middleware.validateRegister, (req, res) => {
    // if logged in, proceed to making a session
    const creds = req.body;
    const loggedIn = (userData) => {
        res.json({
            existing: true,
            created: false,
            data: userData[0],
            token: jwt.sign({'userData': userData[0]}, process.env.SIGNATURE_KEY),
            error: null
        });
    };

    const notLoggedIn = () => {
        res.json({
            existing: false,
            created: false,
            data: null,
            token: null,
            error: null
        });
    };

    const serverError = (error) => {
        res.status(500);
        res.json({
            existing: false,
            created: false,
            data: null,
            error: error
        });
    };

    dbConn.isAccountExisting(creds.username, creds.password, loggedIn, notLoggedIn, serverError);
});

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
            },
            contacts: {}
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

// adds a new contact to the user
app.post('/add-contact', middleware.validatePOSTPermission, (req, res) => {
    // checks if proper parameters are set
    const params = req.body;
    if (params.contactUsername == null || params.key == null)
        return res.json({
            existing: false,
            added: false,
            data: null,
            error: null,
            token: null,
        });

    // checks if the request has permission
    if (!res.dataAllowed)
        return res.json({
            existing: false,
            added: false,
            data: null,
            error: null,
            token: null,
        });


    // checks if the contact is itself
    const accountUsername = res.allowedData.username;
    if (accountUsername == params.contactUsername)
        return res.json({
            existing: true,
            added: false,
            data: null,
            error: null,
            token: null,
        });


    const serverError = (error) => {
        res.status(500);
        res.json({
            existing: false,
            added: false,
            data: null,
            error: error,
            token: null
        });
    }

    const combinationDNE = () => {
        res.json({
            existing: false,
            added: false,
            data: null,
            error: null,
            token: null
        });
    };

    // add to contacts if combination exists
    const userKey = res.allowedData.accountDetails.key;
    const combinationMatched = (userID) => {
        dbConn.addContact(accountUsername, params.contactUsername, params.key, userKey,
            function (userData) {
                res.json({
                    existing: true,
                    added: true,
                    data: userData,
                    error: null,
                    token: jwt.sign({userData}, process.env.SIGNATURE_KEY)
                });
            },
            function () {
                res.json({
                    existing: true,
                    added: false,
                    data: userData,
                    error: error,
                    token: null
                });
            },
            function (error) {
                res.status(500);
                res.json({
                    existing: true,
                    added: false,
                    data: null,
                    error: error,
                    token: null
                });
            });
    };

    // checks the existence of the combination
    dbConn.checkCombination(req.body.contactUsername, req.body.key, combinationMatched, combinationDNE, serverError);
});

// called here so we first check above
// before rendering the pages here
app.use(express.static('public'));
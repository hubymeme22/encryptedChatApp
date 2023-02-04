// this module contains middlewares that will be used for
// different type of validation.

const jwt = require('jsonwebtoken');

// validates the parameters for registering account
function validateRegister(req, res, next) {
    const creds = req.body;
    if (creds.username == null ||
        creds.password == null ||
        creds.username == '' ||
        creds.password == '') {

        // send a malformed response
        res.status(400);
        res.json({
            created: false,
            existing: false,
            data: null,
            error: null,
        });
    } else {
        next();
    }
}

// validates token before accessing a page
function validatePagePermission(req, res, next) {
    // get the cookie and check if this cookie is valid
    const cookies = req.cookies;
    if (cookies.token == null) {
        res.redirect('/login.html');
        return;
    }

    // verifies the token
    jwt.verify(cookies.token, process.env.SIGNATURE_KEY, (err, decoded) => {
        if (err) {
            // redirect to no permission page
            res.status(403);
            res.redirect('/login.html');
            return;
        }

        // allow the process
        res.allowedData = decoded.userData;
        next();
    });
}

// validates token before accessing get request
function validateGETPermission(req, res, next) {
    // get the cookie and check if this cookie is valid
    const cookies = req.cookies;
    if (cookies.token == null) {
        res.status(403);
        res.json({access: false});
        return;
    }

    // verifies the token
    jwt.verify(cookies.token, process.env.SIGNATURE_KEY, (err, decoded) => {
        if (err) {
            // redirect to no permission page
            res.status(403);
            res.json({access: false});
            return;
        }

        // allow the process
        res.allowedData = decoded.userData;
        next();
    });
}



// validates the token for POST requests
function validatePOSTPermission(req, res, next) {
    // get the cookie and check if this cookie is valid
    const token = req.headers.koala;
    if (token == null) {
        res.status(403);
        res.dataAllowed = false;
        return;
    }

    // verifies the token
    jwt.verify(token, process.env.SIGNATURE_KEY, (err, decoded) => {
        if (err) {
            res.status(403);
            res.dataAllowed = false;
            return;
        }

        // allow the process
        res.dataAllowed = true;
        res.allowedData = decoded.userData;
        next();
    });
}


module.exports = {
    validateGETPermission,
    validatePagePermission,
    validatePOSTPermission,
    validateRegister
};
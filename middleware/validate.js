// this module contains middlewares that will be used for
// different type of validation.

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

module.exports = {
    validateRegister
};
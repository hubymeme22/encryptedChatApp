const Accounts = require('../models/account');

// functions that executes the ff. callbacks
// when the user already exist
function isUserExisting(username,
    existingCallback=(userData) => {},
    notExistingCallback=() => {},
    serverError=(error) => {}) {

    Accounts.find({ 'username': username })
        .then((response) => {
            if (response.length > 0) existingCallback(response);
            else notExistingCallback();
        })
        .catch(serverError);
}

// registers the account to the database
// warning: make sure you have done the necessary checks before
// calling this function.
function registerAccount(credentialsJSON,
    successful=(response) => {},
    error=(error) => {}) {

    const newAccount = new Accounts(credentialsJSON);
    newAccount.save().then(successful).catch(error);
}


function loginAccount() {
}


module.exports = {
    isUserExisting,
    registerAccount
};
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

// checks if the credentials matches
function isAccountExisting(username, password,
    existingCallback=(userData) => {},
    notExistingCallback=() => {},
    serverError=(error) => {}) {

    Accounts.find({ 'username': username, 'password': password })
        .then((response) => {
            if (response.length > 0) existingCallback(response);
            else notExistingCallback();
        })
        .catch(serverError);
}

// adds new contact to the account
function addContact(accountUsername, contactUsername, key,
    existingCallback=(userData) => {},
    notExistingCallback=() => {},
    serverError=(error) => {}) {

    // upsert the data provided
    const findAccount = { 'username': accountUsername };
    const updateQuery = { '$set': { [`contacts.${contactUsername}`]: key }};
    const upsert = { new: true, upsert: true };

    Accounts.findOneAndUpdate(findAccount, updateQuery, upsert)
        .exec((error, userData) => {
            if (error) return serverError(error);
            if (!userData) return notExistingCallback();

            return existingCallback(userData);
        });
}

// checks if the username + key combination does exist
function checkCombination(contactUsername, key,
    existingCallback=(userID) => {},
    notExistingCallback=() => {},
    serverError=(error) => {}) {

    Accounts.exists({ username: contactUsername, 'accountDetails.key': key })
        .then(userID => {
            if (!userID) return notExistingCallback();
            return existingCallback(userID);
        })
        .catch(serverError);
}


module.exports = {
    addContact,
    checkCombination,
    isAccountExisting,
    isUserExisting,
    registerAccount
};
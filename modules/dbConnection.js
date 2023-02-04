const Accounts = require('../models/account');
const Chats = require('../models/chat');

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
    const newChat = new Chats({
        username: credentialsJSON.username,
        messages: {
        }
    });

    // create account for both accounts and chat collection
    newAccount.save().then(data => {
        newChat.save().then(successful).catch(error);
    }).catch(error);
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
function addContact(accountUsername, contactUsername, key, key1,
    existingCallback=(userData) => {},
    notExistingCallback=() => {},
    serverError=(error) => {}) {

    // upsert the data provided
    const findAccount = { 'username': accountUsername };
    const updateQuery = { '$set': { [`contacts.${contactUsername}`]: key }};
    const findAccount1 = { 'username': contactUsername };
    const updateQuery1 = { '$set': { [`contacts.${accountUsername}`]: key1 }};
    const upsert = { new: true, upsert: true };

    Accounts.findOneAndUpdate(findAccount, updateQuery, upsert)
        .exec((error, userData) => {
            if (error) return serverError(error);
            if (!userData) return notExistingCallback();

            // update the contact's details
            Accounts.findOneAndUpdate(findAccount1, updateQuery1, upsert)
            .exec((error1, userData1) => {
                if (error1) return serverError(error);
                if (!userData1) return notExistingCallback();

                existingCallback(userData);
            });
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

function getUserMessages(username,
    existingCallback=(msgData) => {},
    notExistingCallback=() => {},
    serverError=(error) => {}) {

    Chats.findOne({ username: username })
        .then(msgData => {
            if (msgData == null) return notExistingCallback();
            existingCallback(msgData);
        })
        .catch(error => {
            serverError(error);
            console.log(error);
        });
}

// updates message for both sides on database
function updateMessage(username, contactUsername, message,
    existingCallback=(msgData) => {},
    notExistingCallback=() => {},
    serverError=(error) => {}) {

    // upsert data for chats
    const findUserChat = { username: username };
    const userQuery = { '$push': { [`messages.${contactUsername}`]: [message, Date.now(), 'me'] } };

    const findContactChat = { username: contactUsername };
    const contactQuery = { '$push': { [`messages.${username}`]: [message, Date.now(), 'con'] } };

    const upsert = { new: true, upsert: true };

    // execute the queries below
    Chats.findOneAndUpdate(findUserChat, userQuery, upsert)
        .exec((error, userData) => {
            if (error) return serverError(error);
            if (!userData) return notExistingCallback();

            Chats.findOneAndUpdate(findContactChat, contactQuery, upsert)
                .exec((error, userData) => {
                    if (error) return serverError(error);
                    if (!userData) return notExistingCallback();

                    existingCallback(userData);
                });

        });

}

module.exports = {
    addContact,
    checkCombination,
    getUserMessages,
    isAccountExisting,
    isUserExisting,
    registerAccount,
    updateMessage
};
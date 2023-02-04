const jwt = require('jsonwebtoken');
const edCryptor = require('./experimental-encryption');

require('dotenv').config();

// contains map for encryption that will be used
const userNumberMap = {};
const userEncryptionMap = {};

const generateKey = (username, key) => {
    if (userNumberMap[username] != null)
        return userNumberMap[username][0];

    const generatedNumber = Math.ceil(Math.random() * 5064);
    userNumberMap[username] = [generatedNumber, key];
    userEncryptionMap[username] = new edCryptor(generatedNumber);

    return userNumberMap[username][0];
};

const getEDCryptor = (username) => {
    return userEncryptionMap[username];
};

const getUserKey = (username) => {
    return userNumberMap[username][1];
};

module.exports = {
    generateKey,
    getEDCryptor,
    getUserKey,
};
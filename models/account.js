const mongoose = require('mongoose');

// document structure to send/recieve
const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    accountDetails: {
        type: Map,
        required: false
    }
}, { timestamps: true });

// model: provides inerface that communicates with the database
const Account = mongoose.model('accounts', accountSchema);
module.exports = Account;
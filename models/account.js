const mongoose = require('mongoose');

// document structure to send/recieve
const accountSchema = new mongoose.Schema({
    username: String,
    password: String,
    accountDetails: Map,
    contacts: {
        type: Map,
        contactUsername: {
            type: Map,
            key: String
        }
    }
}, { timestamps: true });

// model: provides inerface that communicates with the database
const Account = mongoose.model('accounts', accountSchema);
module.exports = Account;
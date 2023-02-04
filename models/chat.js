const mongoose = require('mongoose');
const chatSchema = mongoose.Schema({
    username: String,
    messages: {
        type: Map,
        contactUsername: [{
            type: mongoose.Schema.Types.Mixed,
            default: ['', Date.now(), '']
        }]
    }
});

const Chat = mongoose.model('chats', chatSchema);
module.exports = Chat;
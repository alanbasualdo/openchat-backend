const mongoose = require('mongoose')

const Messages = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Messages', Messages)
const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        require: false
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', User)
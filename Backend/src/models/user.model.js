const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'username already taken'],
        required: true,
    },

    email: {
        type: String,
        unique: [true, 'Account already exist with this Email address'],
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User

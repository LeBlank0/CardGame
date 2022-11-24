const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        Required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    spotify: {
        access: String,
        refresh: String,
    }
});

module.exports = mongoose.model('User', userSchema);
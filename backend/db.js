const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://mayureshpitambare:Riddhi24@cluster0.6laimla.mongodb.net/paytmApp');

// Simple Schema defination
// const UserSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     firstName: String,
//     lastName: String
// });

// Elegant Schema Defination
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },

    password: {
        type: String,
        required: true,
        minLength: 6
    },

    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },

    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
});

const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Account', AccountSchema);

module.exports = {
    User,
    Account
}

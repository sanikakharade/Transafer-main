const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// connect to db
mongoose.connect("mongodb+srv://admin:%40Darsh.56763@cluster0.von7nfx.mongodb.net/paytm")
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(err => {
        console.log("Error connecting to Database", err);
    });

// user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password_hash: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// hashing and validating methods
userSchema.methods.generateHash = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
};

userSchema.methods.validatePassword = async function (password) {
    const validPassword = await bcrypt.compare(password, this.password_hash);
    return validPassword;
};

// user model
const User = mongoose.model("User", userSchema);

// account schema
const accountSchema = new mongoose.Schema({
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        required: true,
        ref: "User"
    }
});

// account model
const Account = mongoose.model("Account", accountSchema);

module.exports = {
    User,
    Account
};
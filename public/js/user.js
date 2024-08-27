const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userID: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9]+$/
    },
    password: {
        type: String,
        required: true,
    },
    user_type : {
        type: String,
        default: 'user'
        // Owner > Administrator > Moderator > user
    },
    joinDate: {
        required: true,
        type: String
    },
    tempCode: {
        required: false,
        type: String
    },
    ownedChips: {
        type: Map,
        of: Number,
        default: {}
    }
    
    // *White: $1
    // *Red: $5
    // *Blue: $10
    // *Green: $25
    // *Black: $100
    // *Purple: $500
    // Orange: $1,000
    // Pink: $5,000
    // Yellow: $10,000
    // Gray: $25,000
    // Brown: $50,000



});
// app.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const MongoDBSession = require('connect-mongo');
const express = require('express');
const session = require('express-session');
const Joi = require("joi");
const mongoose = require('mongoose');
const path = require('path');

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database_session = process.env.MONGODB_DATABASE_SESSION;
const mongodb_database_user = process.env.MONGODB_DATABASE_USER;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database_user}?retryWrites=true&w=majority`;
const saltRounds = 12;
const expireTime = 1 * 60 * 60 * 1000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");


mongoose.connect(mongoURI, {}).then((res) => {
    console.log("MongoDB Connected");
});

// Connect to user data database
const userDB = mongoose.createConnection(mongoURI, {});

const store = MongoDBSession.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
    crypto: {
        secret: mongodb_session_secret
    },
    ttl: 3600
});

app.use(session({
    secret: process.env.NODE_SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: store,
    cookie: {
        maxAge: expireTime,
    }
}));

const specialCharPattern = /^[^'",\\;<>|&$(){}\[\]%=+]*$/;
const schema = Joi.object({
    name: Joi.string().min(2).max(30).pattern(specialCharPattern).required(),
    userID: Joi.string().min(2).max(30).pattern(specialCharPattern).required(),
    email: Joi.string().email().min(7).max(30).pattern(specialCharPattern).required(),
    password: Joi.string().min(6).max(30).pattern(specialCharPattern).required()
});

const hasSession = (req, res, next) => {
    if (!req.session.hasSession) {
        return res.redirect('/');
    } else {
        return next();
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user_type == 'admin') {
        return next();
    } else {
        return res.redirect('/403');
    }
}

const getUsers = async (req, res, next) => {
    const users = await UserModel.find({});
    req.users = users;
    next();
};

app.get("/", async (req, res, next) => {
    var name = req.session.username || 'N/A';
    var errorMsg = '';
    var wizardStatus = 'base';
    console.log('wizard status: '+ wizardStatus);
    const hasSession = req.session.hasSession || false;
    res.render('home', { errorMsg, name, hasSession, wizardStatus });
});

app.post("/", async (req, res, next) => {
    // Check if user is already logged in
    if (req.session.hasSession) {
        return res.redirect('/');
    }
});

app.post('/signUpSubmit', (req, res) => {
    const { name, userID, email, password } = req.body;

    // Validate input
    const validation = schema.validate({ name, userID, email, password }, { abortEarly: false });

    if (validation.error) {
        // Initialize an array to store the error messages
        let errorMsg = [];

        validation.error.details.forEach((detail) => {
            const fieldName = detail.context.key;

            // Check for empty fields
            if (detail.type === 'any.required') {
                errorMsg.push(`${fieldName} should be filled.\n`);
            }

            if (detail.type === 'string.min') {
                errorMsg.push(`${fieldName} must be at least ${detail.context.limit} characters long.\n`);
            }

            // Check for fields longer than 30 characters
            if (detail.type === 'string.max') {
                errorMsg.push(`${fieldName} cannot be longer than 30 characters.\n`);
            }

            // Check for invalid special characters
            if (detail.type === 'string.pattern.base') {
                errorMsg.push(`You may use any special characters except ', ", \\, ;, <, >, &, |, $, (, ), {, }, [, ], %, =, + in ${fieldName}.\n`);
            }
        });

        // Send all error messages as a single string
        return res.render('home', {errorMsg, hasSession, name, wizardStatus: 'signUp'});
    }

    // Handle the sign-up logic here...

    res.redirect('/');
});

app.post('/signInSubmit', (req, res) => {
    const { userID, password } = req.body;
    // Check if user is already logged in
    if (req.session.hasSession) {
        return res.redirect('/');
    }
    // Handle the sign-in logic here...
    // Example:
    // UserModel.findOne({ userID }, (err, user) => {
    //     if (err) throw err;
    //     if (!user) {
    //         return res.render('home', { errorMsg: 'Invalid user ID or password.', hasSession, wizardStatus:'signIn' });
    //     }
    //     bcrypt.compare(password, user.password, (err, result) => {
    //         if (err) throw err;
    //         if (result) {
    //             req.session.hasSession = true;
    //             req.session.username = user.name;
    //             req.session.user_type = user.user_type;
    //             res.redirect('/');
    //         } else {
    //             return res.render('home', { errorMsg: 'Invalid user ID or password.', hasSession, wizardStatus:'signIn' });
    //         }
    //



});

app.post('/signOut', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
});

app.get('*', (req, res) => {
    res.status(404).render('404', { hasSession });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
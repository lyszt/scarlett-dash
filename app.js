import './App.css';
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const express = require('express');
const path = require('path');

const app = express();

// Environment
require('dotenv').config();

// Static serving
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic route
app.get('/', (req
                      , res) => {
    res.json({message: 'Hello world.', timestamp: Date.now()});

})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

// Auth
passport.serializeUser(function(user, done) {
    done(null, user.id);
});passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

const userSchema = new mongoose.Schema ({

    googleId: String
});
userSchema.plugin(findOrCreate);const User = new mongoose.model("User", userSchema);
passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/callback/url",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));
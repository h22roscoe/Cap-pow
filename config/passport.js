var LocalStrategy = require('passport-local').Strategy;

var models = require('../app/models');

function findUser(req, username, password, done) {
    "use strict";

    models.User.find({
        where: {
            'username': username
        }
    }).then(function (err, user) {
        if (err) {
            return done(err);
        }

        // Check to see if theres already a user with that email
        if (user) {
            return done(null, false,
                req.flash("signupMessage",
                          "That username is already taken."));
        } else {
            // If there is no user with that username create the user
            models.User.create({
                where: {
                    username: username,
                    password: password
                }
            });
        }
    });
}

function findUserLogin(req, username, password, done) {
    "use strict";

    models.User.find({
        where: {
            'username': username
        }
    }).then(function (err, user) {
        if (err) {
            return done(err);
        }

        // if no user is found, return the message
        if (!user) {
            return done(null, false, req.flash("loginMessage",
                                               "No user found."));
        }

        // if the user is found but the password is wrong
        if (!user.validPassword(password)) {
            return done(null, false,
                req.flash("loginMessage", "Oops! Wrong password."));
        }

        // all is well, return successful user
        return done(null, user);
    });
}

// Expose this function to our app using module.exports
module.exports = function (passport) {
    "use strict";
    // Passport session setup
    // Required for persistent login sessions
    // Passport needs ability to serialize and unserialize users out of session

    // Used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // Used to deserialize the user
    passport.deserializeUser(function (user, done) {
        models.User.find({
            where: {
                id: user.id
            }
        }).success(function (user) {
            done(null, user);
        }).error(function (err) {
            done(err, null);
        });
    });

    // LOCAL SIGNUP
    // We are using named strategies since we have one for login and one
    //  for signup by default
    passport.use('local-signup',
        new LocalStrategy({
            // By default, local strategy uses username and password,
            // we will override with email
            usernameField: 'username',
            passwordField: 'password',

            // Allows us to pass back the entire request to the callback
            passReqToCallback: true
        }, function (req, username, password, done) {
                // Asynchronous
                // User.findOne wont fire unless data is sent back
            process.nextTick(
                findUser.bind(null, req, username, password, done)
            );
        })
    );

    passport.use('local-login',
        new LocalStrategy({
            // By default, local strategy uses username and password, we will
            // override with email
            usernameField: 'username',
            passwordField: 'password',

            // Allows us to pass back the entire request to the callback
            passReqToCallback: true
        }, function (req, username, password, done) {
            findUserLogin(req, username, password, done);
        })
    );
};

var LocalStrategy = require('passport-local').Strategy;

var models = require('../app/models');

function findUser(req, username, password, done) {
    "use strict";

    models.users.find({
        where: {
            "username": username
        }
    }).then(function (user) {
        // Check to see if theres already a user with that email
        if (user) {
            return done(null, false,
                req.flash("signupMessage",
                          "That username is already taken."));
        } else {
            // If there is no user with that username create the user
            models.users.create({
                    "username": username,
                    "password": password
            }).then(function (user) {
                return done(null, user);
            }).error(function (err) {
                return done(err);
            });
        }
    }).error(function (err) {
        return done(err);
    });
}

function findUserLogin(req, username, password, done) {
    "use strict";

    models.users.find({
        where: {
            "username": username
        }
    }).then(function (user) {
        // If no user is found, return the message
        if (!user) {
            return done(null, false, req.flash("loginMessage",
                                               "No user found."));
        }

        // If the user is found but the password is wrong
        if (!models.users.validPassword(password, user.password)) {
            return done(null, false,
                req.flash("loginMessage", "Oops! Wrong password."));
        }

        // All is well, return successful user
        return done(null, user);
    }).error(function (err) {
        return done(err);
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
        models.users.find({
            where: {
                "id": user.id
            }
        }).then(function (user) {
            done(null, user);
        }).error(function (err) {
            done(err, null);
        });
    });

    // LOCAL SIGNUP
    // We are using named strategies since we have one for login and one
    // for signup by default
    passport.use("local-signup",
        new LocalStrategy({
            // Allows us to pass back the entire request to the callback
            passReqToCallback: true
        }, function (req, username, password, done) {
            process.nextTick(
                findUser.bind(null, req, username, password, done)
            );
        })
    );

    passport.use("local-login",
        new LocalStrategy({
            // Allows us to pass back the entire request to the callback
            passReqToCallback: true
        }, function (req, username, password, done) {
            findUserLogin(req, username, password, done);
        })
    );
};

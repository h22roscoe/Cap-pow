var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var configDB = require("./database");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(configDB.url, {
    dialect: "postgres"
});

var User = require('../app/models/user')(sequelize, Sequelize);

function findUser(username, password, done) {
    User.find({
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
                          "That email is already taken."));
        } else {
            // If there is no user with that email create the user
            User.create({
                where: {
                    username: username,
                    password: password
                }
            })
        }
    });
}

function findUserLogin(err, user, password, done) {
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
}

// Expose this function to our app using module.exports
module.exports = function (passport) {
    // Passport session setup
    // Required for persistent login sessions
    // Passport needs ability to serialize and unserialize users out of session

    // Used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.find({
            where: {
                id: user.id
            }
        }).then(function (err, user) {
            done(err, user);
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
            process.nextTick(findUser.bind(null, username, password, done));
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
            User.find({
                where: {
                    'username': username
                }
            }).then(function (err, user) {
                findUserLogin(err, user, password, done);
            });
        })
    );
};

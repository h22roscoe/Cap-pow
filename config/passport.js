var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

function createNewUser(email, password, done) {
    // If there is no user with that email create the user
    var newUser = new User();

    // set the user's local credentials
    newUser.local.email = email;
    newUser.local.password =
        newUser.generateHash(password);

    // Save the user
    newUser.save(function (err) {
        if (err) {
            throw err;
        }

        return done(null, newUser);
    });
}

function findUser(email, password, done) {
    // Find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login
    // already exists
    User.findOne({
        'local.email': email
    }, function (err, user) {
        // if there are any errors, return the error
        if (err) {
            return done(err);
        }

        // Check to see if theres already a user with that email
        if (user) {
            return done(null, false,
                req.flash("signupMessage",
                    "That email is already taken."));
        } else {
            createNewUser(email, password, done);
        }
    });
}

function findUserLogin(err, user, password, done) {
    // if there are any errors, return the error before anything else
    if (err) {
        return done(err);
    }

    // if no user is found, return the message
    if (!user) {
        return done(null, false, req.flash('loginMessage',
            'No user found.'));
    }

    // if the user is found but the password is wrong
    if (!user.validPassword(password)) {
        return done(null, false,
            req.flash('loginMessage',
                'Oops! Wrong password.'));
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

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP
    // We are using named strategies since we have one for login and one
    //  for signup by default, if there was no name, it would just be
    //  called 'local'
    passport.use('local-signup',
        new LocalStrategy({
            // By default, local strategy uses username and password,
            // we will override with email
            usernameField: 'email',
            passwordField: 'password',

            // allows us to pass back the entire request to the callback
            passReqToCallback: true
        }, function (req, email, password, done) {
            // Asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(findUser.bind(null, email, password, done));
        })
    );

    passport.use('local-login',
        new LocalStrategy({
            // By default, local strategy uses username and password, we will
            // override with email
            usernameField: 'email',
            passwordField: 'password',

            // allows us to pass back the entire request to the callback
            passReqToCallback: true
        }, function (req, email, password, done) {
            // Find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'local.email': email
            }, function (err, user) {
                findUserLogin.bind(null, err, user, password, done);
            })
        });
    );
};

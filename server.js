var express = require("express");
var app = express();
var passport = require("passport");
var flash = require("connect-flash");
var pg = require("pg");

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var PORT = process.env.PORT || 8080;

// Log every request to the console
app.use(morgan("dev"));

// Read cookies (needed for auth)
app.use(cookieParser());

// Get information from HTML forms
app.use(bodyParser());

/*
 * May want to set a view engine here e.g. app.set("view engine", "hulk");
 * and hulk = require('hulk-hogan');
 */

// -- Required for passport --
// Session secret
app.use(session({
    secret: "weshouldputarealkeyhereatsomepoint"
}));

app.use(passport.initialize());

// Persistent login sessions
app.use(passport.session());

// Use connect-flash for flash messages stored in session
app.use(flash());

var connectString = process.env.DATABASE_URL || "postgres://localhost:5432/";
var client = new pg.Client(connectString, function (err, client, done) {
    if (err) {
        return console.error('error fetching client from pool', err);
    }

    // Stuff to do when connected to the DB
});

// TODO: May not use this guy's directory structure so check this.
require('./app/routes.js')(app, passport);

app.listen(PORT, function () {
    console.log('The magic happens on port ' + PORT);
});

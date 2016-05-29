var express = require("express");
var app = express();
var passport = require("passport");
var mongoose = require("mongoose");
var flash = require("connect-flash");
// var pg = require("pg");

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

// TODO: May not use this guy's directory structure so check this.
var route = require("./app/routes.js");

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

// pass passport for configuration
require('./config/passport')(passport);

// set up ejs for templating
app.set('view engine', 'ejs');

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

route(app, passport);

app.listen(PORT, function () {
    console.log('The magic happens on port ' + PORT);
});

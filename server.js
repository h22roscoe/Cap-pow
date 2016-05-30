var express = require("express");
var passport = require("passport");
var flash = require("connect-flash");
var pg = require("pg").native;
var models = require("./app/models");

var app = express();

var connString = process.env.DATABASE_URL ||
    "fbqlonrijrmpwe:" + "irYdc-vj42ES0_GO6WXZfOIxTd@"
    + "ec2-54-228-226-93.eu-west-1.compute.amazonaws.com:"
    + "5432/" + "d9cipg8t3q8pu2";

// Connect to our database
pg.defaults.ssl = true;
pg.connect(connString, function () {
    "use strict";

    console.log("Connected to the database");
});

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var PORT = process.env.PORT || 8080;

app.set('views', __dirname + '/views');

// Log every request to the console
app.use(morgan("dev"));

// Read cookies (needed for auth)
app.use(cookieParser());

// Get information from HTML forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// pass passport for configuration
require('./config/passport')(passport);

// set up ejs for templating
app.set('view engine', 'ejs');

// -- Required for passport --
// Session secret
app.use(session({
    secret: "weshouldprobablyaddapropersecrethere",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());

// Persistent login sessions
app.use(passport.session());

// Use connect-flash for flash messages stored in session
app.use(flash());

// TODO: May not use this guy's directory structure so check this.
var route = require("./app/routes");
route(app, passport);

models.sequelize.sync().then(function () {
    "use strict";

    app.listen(PORT, function () {
        console.log('The magic happens on port ' + PORT);
    });
});

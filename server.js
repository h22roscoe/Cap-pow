var express = require("express");
var app = express();
var passport = require("passport");
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

app.set("views", __dirname + "/views");

app.set("view options", {
    layout: false
});

app.set("view engine", "hulk");
app.register(".hulk", hulk);

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
    var handleError = function (err) {
        // no error occurred, continue with the request
        if (!err) return false;

        // An error occurred, remove the client from the connection pool.
        // A truthy value passed to done will remove the connection from the pool
        // instead of simply returning it to be reused.
        // In this case, if we have successfully received a client (truthy)
        // then it will be removed from the pool.
        if (client) {
            done(client);
        }

        res.writeHead(500, {
            "content-type": "text/plain"
        });

        res.end('An error occurred');
        return true;
    };

    // Stuff to do when connected to the DB
});

route(app, passport);

models.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log('The magic happens on port ' + PORT);
    });
});

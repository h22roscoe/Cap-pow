var express = require("express");
var passport = require("passport");
var flash = require("connect-flash");
var pg = require("pg");
var models = require("./app/models");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server, {
    pingTimeout: 300000,
    pingInterval: 25000
});
var rooms = require("./rooms");
var roomData = require("roomdata");

io.serveClient(true);

pg.defaults.ssl = true;

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var roomNsp = io.of("/room");
var gameNsp = io.of("/game");

// pass passport for configuration
require("./config/passport")(passport);

var PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public/views");

// Log every request to the console
app.use(morgan("dev"));

// Read cookies (needed for auth)
app.use(cookieParser());

// Get information from HTML forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// set up ejs for templating
app.set("view engine", "ejs");

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

// Whenever a user connects set up default event listeners.
roomNsp.on("connection", function(socket) {
    console.log("Setup: A user connected");
    rooms(roomNsp, models, socket);
});

var POWER_UPS = [
    "makeFast",
    "makeSlow",
    "makeFreeze",
    "makeLight",
    "makeHeavy"
]

var OFFSET = 1;

var MAX_POWER_UPS = powerUpPositions.length - OFFSET;

gameNsp.on("connection", function(socket) {
    console.log("Game: A user connected");

    socket.on("joinGame", function(gameData) {
        roomData.joinRoom(socket, gameData.roomName);
        var ownerId = roomData.get(socket, "owner");

        if (socket.id === ownerId) {
            roomData.set(socket, "powerUpsGiven", 0);
            roomData.set(socket, "powerUpPositions", [{
                x: 380,
                y: 70
            }, {
                x: 1218,
                y: 189
            }, {
                x: 273,
                y: 441
            }]);

            function loop() {
                var randTime = Math.round(
                    Math.random() * (20000 - 5000)) + 5000;
                var randPowerUp = Math.floor(
                    Math.random() * POWER_UPS.length);
                var randPos =
                    Math.floor(
                        Math.random() * roomData.get(
                            socket, "powerUpPositions").length);

                setTimeout(function() {
                    if (roomData.get(socket, "powerUpPositions") < MAX_POWER_UPS) {
                        var powerUpPositions = roomData.get(
                            socket, "powerUpPositions");

                        console.log("Before: ", powerUpPositions);
                        console.log("index: ", randPos);

                        var pos = powerUpPositions.splice(randPos, 1);

                        console.log("After: ", powerUpPositions);
                        console.log("Spliced: ", pos);
                        console.log("-----------------------");

                        roomData.set(
                            socket, "powerUpPositions", powerUpPositions);

                        gameNsp.to(gameData.roomName)
                            .emit(POWER_UPS[randPowerUp], pos[0]);
                        roomData.set(socket, "powerUpsGiven",
                            roomData.get(socket, "powerUpsGiven") + 1);
                    }

                    loop();
                }, randTime);
            }

            loop();
        }

        setTimeout(function() {
            socket.emit("connected", {
                playerId: gameData.playerId
            });
        }, 1000);

        socket.on("update", function(updateInfo) {
            socket.broadcast.to(gameData.roomName)
                .emit("updated", updateInfo);
        });

        socket.on("points", function(updateInfo) {
            socket.broadcast.to(gameData.roomName)
                .emit("newScore", updateInfo);
        });

        socket.on("powerUp", function(powerUpInfo) {
            console.log("Someone got a powerUp with this x: ", powerUpInfo.x);
            console.log("It had this y: ", powerUpInfo.y);

            socket.broadcast.to(gameData.roomName)
                .emit("powerupAcquired", powerUpInfo);

            var powerUpPositions = roomData.get(socket, "powerUpPositions");

            console.log("This is our possible positions list before: ", powerUpPositions);

            powerUpPositions.push({
                x: powerUpInfo.x,
                y: powerUpInfo.y
            });

            console.log("This is our possible positions list after: ", powerUpPositions);

            roomData.set(socket, "powerUpPositions", powerUpPositions);

            roomData.set(socket, "powerUpsGiven",
                roomData.get(socket, "powerUpsGiven") - 1);
        });
    });
});

models.sequelize.sync().then(function() {
    "use strict";

    server.listen(PORT, function() {
        console.log('The magic happens on port ' + PORT);
    });
});

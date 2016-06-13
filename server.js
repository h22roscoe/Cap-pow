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
var roomData = require("./app/roomdata");
roomData.Debug = true;

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
    rooms(roomNsp, models, roomData, socket);
});

var POWER_UPS = [
    "makeFast",
    "makeSlow",
    "makeFreeze",
    "makeLight",
    "makeHeavy",
    "makeFlagMove",
    "makeFlagMove",
    "makeFlagMove"
]

var MAX_POWER_UPS = 5;

gameNsp.on("connection", function(socket) {
    console.log("Game: A user connected");
    var timeout;

    socket.on("joinGame", function(gameData) {
        roomData.rejoinRoom(socket, gameData.roomName);

        var spriteId = roomData.getPlayerNumber(socket, gameData.playerId);
        var winPoints = roomData.get(socket, "winPoints");

        var startPos = {
            0: {
                x: 231,
                y: 84
            },

            1: {
                x: 104,
                y: 693
            },

            2: {
                x: 1365,
                y: 525
            },

            3: {
                x: 1323,
                y: 41
            }
        };

        socket.emit("gameInfo", {
            id: spriteId,
            startPos: startPos[spriteId],
            winPoints: winPoints
        });

        var ownerId = roomData.get(socket, "owner");

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
            }, {
                x: 658,
                y: 534
            }, {
                x: 1230,
                y: 689
            }, {
                x: 1127,
                y: 414
            }, {
                x: 491,
                y: 790
            }, {
                x: 103,
                y: 363
            }

          ]);

            roomData.set(socket, "flagPositions", [{
                x: 698,
                y: 552
            }, {
                x: 98,
                y: 720
            }, {
                x: 1044,
                y: 258
            }, {
                x: 939,
                y: 447
            }, {
                x: 750,
                y: 741
            }, {
                x: 119,
                y: 69
            }, {
                x: 120,
                y: 259
            }, {
                x: 582,
                y: 363
            }, {
                x: 687,
                y: 342
            }]);

            if (gameData.playerId === ownerId) {
                var flagMoveInterval = setInterval(function() {
                    var flagPositions = roomData.get(socket, "flagPositions");
                    var randomIndex = Math.floor(Math.random() * flagPositions.length);

                    gameNsp.to(gameData.roomName)
                        .emit("powerupAcquired", {
                            name: "FlagMove",
                            flagPos: flagPositions[randomIndex]
                        });
                }, 15000)

            function loop() {
                var randTime = Math.round(
                    Math.random() * (20000 - 5000)) + 5000;
                var randPowerUp = Math.floor(
                    Math.random() * POWER_UPS.length);
                var randPos =
                    Math.floor(
                        Math.random() * roomData.get(
                            socket, "powerUpPositions").length);

                timeout = setTimeout(function() {
                    if (roomData.get(socket, "powerUpsGiven") < MAX_POWER_UPS) {
                        var powerUpPositions = roomData.get(
                            socket, "powerUpPositions");

                        var pos = powerUpPositions.splice(randPos, 1);

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

        socket.on("gameWon", function(updateInfo) {
            console.log("This guy won!: ", updateInfo.playerId);
            gameNsp.to(gameData.roomName)
                .emit("gameWon", updateInfo);
        });

        socket.on("respawn", function (updateInfo) {
            var randIdx = Math.floor(Math.random() * 4);
            var randPos = startPos[randIdx];

            socket.emit("respawn", function () {
                newPos: randPos
            })
        })

        socket.on("powerUp", function(powerUpInfo) {
            if (powerUpInfo.name === "FlagMove") {
                var flagPositions = roomData.get(socket, "flagPositions");
                var randomIndex = Math.floor(Math.random() * flagPositions.length);
                powerUpInfo.flagPos = flagPositions[randomIndex];

                gameNsp.to(gameData.roomName)
                    .emit("powerupAcquired", powerUpInfo);
            } else {
                socket.broadcast.to(gameData.roomName)
                    .emit("powerupAcquired", powerUpInfo);
            }

            var powerUpPositions = roomData.get(socket, "powerUpPositions");

            powerUpPositions.push({
                x: powerUpInfo.x,
                y: powerUpInfo.y
            });

            roomData.set(socket, "powerUpPositions", powerUpPositions);

            roomData.set(socket, "powerUpsGiven",
                roomData.get(socket, "powerUpsGiven") - 1);
        });
    });

    socket.on("disconnect", function() {
        clearTimeout(timeout);
    });
});

models.sequelize.sync().then(function() {
    "use strict";

    server.listen(PORT, function() {
        console.log('The magic happens on port ' + PORT);
    });
});

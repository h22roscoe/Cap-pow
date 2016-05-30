var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var rooms = require("./serverRoom.js");

//TODO: Could be /web or /group_directory, etc.
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    //render login html.
    res.render("/index.html");
});

// Tracks number of players and gives each player a unique id
var playerCount = 0;
var id = 0;
//Port is 3000 by default
var PORT = process.env["PORT"] || 3000;

// Whenever a user connects...
io.on("connection", function (socket) {
    console.log("A user connected");
    rooms.startGame();
});

server.listen(PORT, function () {
    console.log("Multiplayer app listening on port " + PORT);
});

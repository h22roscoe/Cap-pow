var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

//TODO: Could be /web or /group_directory, etc.
app.use(express.static(__dirname));

app.get('/', function (req, res) {
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

    // Increment number of players as a new player connected
    playerCount++;
    id++;

    // 1.5 second delay before sending the user their id and emit the player
    // count to every player, allowing the player count to be updated in the
    // game, to ensure that the user has time to load the proper javascript
    // files first
    setTimeout(function () {
        socket.emit("connected", {
            playerId: id
        });

        io.emit("count", {
            playerCount: playerCount
        });

    }, 1500);

    // On a disconnect we just tell every player that the player
    // count has decreased
    socket.on("disconnect", function () {
        console.log("A user disconnected");

        playerCount--;

        io.emit("count", {
            playerCount: playerCount
        });
    });

    socket.on("update", function (data) {
        socket.broadcast.emit("updated", data);
    });
});

// Server listens for http connections only at the moment
server.listen(PORT, function () {
    console.log("Multiplayer app listening on port " + PORT);
});

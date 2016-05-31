var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var rooms = require("./rooms");

//Port is 3000 by default
var PORT = process.env.PORT || 3000;

//TODO: Could be /web or /group_directory, etc.
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    //render login html.
    res.render("/index.html");
});

// Whenever a user connects set up default event listeners.
io.on("connection", function (socket) {
    console.log("A user connected");
    rooms(io, socket);
});

server.listen(PORT, function () {
    console.log("Multiplayer app listening on port " + PORT);
});

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//TODO: Could be /web or /group_directory, etc.
app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.render('/index.html');
});

var playerCount = 0;
var id = 0;

io.on('connection', function (socket) {
    console.log("A user connected");

    playerCount++;
    id++;

    setTimeout(function () {
        socket.emit('connected', {
            playerId: id
        });

        io.emit('count', {
            playerCount: playerCount
        });

    }, 1500);

    socket.on('disconnect', function () {
        console.log("A user disconnected");

        playerCount--;

        io.emit('count', {
            playerCount: playerCount
        });
    });

    socket.on('update', function (data) {
        socket.broadcast.emit('updated', data);
    });
});

server.listen(3000, function () {
    console.log("Multiplayer app listening on port 3000");
});

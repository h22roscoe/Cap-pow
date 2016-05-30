var io;
var gameSocket;
var playerCount; //per room
const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;

exports.startGame = function (socketIO, socket) {
    io = socketIO;
    gameSocket = socket;

    io = sio;
    gameSocket = socket;
    // gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('roomFull', prepareGame);
    gameSocket.on('countdownFinished', startGame);

    // Player Events
    gameSocket.on('joinGame', joinGame);
    gameSocket.on('player', playerRestart);
}

/*
    HOST ACTIONS
*/


// host creates a new room which people can join
function createNewGame() {
    // Create a unique Socket.IO Room
    var gameId = (Math.random() * 100000) | 0;

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {
        gameId: gameId,
        mySocketId: this.id
    });

    // Join the Room and wait for the players
    this.join(gameId.toString());

    //maybe render lobby screen for the host
}

//called when there are between 2 and 4 players present
//stops people being able to connect to this room as it
//is removed from the list of available rooms.
function prepareGame(gameId) {
    var data = {
        socketId: this.id,
        gameId: gameId
    };

    io.sockets.in(gameId).emit('beginNewGame', data);
}

//
function startGame(gameId) {
    console.log('Game Started.');
    //game html rendered in here
    //for each player the quintus engine is
    //created, a player object is create and
    //added to other players actor in room.
}

/*
    PLAYER ACTIONS
*/

//called when a player clicks on a room to join it
//takes that player to the lobby screen
function joinGame(data) {
    var room = gameSocket.manager.rooms["/" + data.gameId];

    if (room != undefined) {
        data.socketId = this.id;
        this.join(data.gameId);
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
    } else {
        this.emit('error', {
            message: "This room does not exist."
        });
    }
}


//// Increment number of players as a new player connected
//playerCount++;
//id++;
//
//// 1.5 second delay before sending the user their id and emit the player
//// count to every player, allowing the player count to be updated in the
//// game, to ensure that the user has time to load the proper javascript
//// files first
//setTimeout(function () {
//    socket.emit("connected", {
//        playerId: id
//    });
//
//    io.emit("count", {
//        playerCount: playerCount
//    });
//
//}, 1500);
//
//
//}
//
//// On a disconnect we just tell every player that the player
//// count has decreased
//socket.on("disconnect", function () {
//    console.log("A user disconnected");
//
//    playerCount--;
//
//    io.emit("count", {
//        playerCount: playerCount
//    });
//});
//
//socket.on("update", function (data) {
//    socket.broadcast.emit("updated", data);
//});
//
////helper function called when we are notified by the server to create a new room
//setUpObject.createNewRoom = function (data) {
//
//    //create random room ID
//    var gameId = (Math.random * 100000) | 0
//
//    socket.emit('roomCreated', {
//        gameID,
//    })
//}

var io;
var gameSocket;
var id = 0;

// Per room, think it will be moved to client side
var playerCount;
var MAX_PLAYERS = 4;
var MIN_PLAYERS = 2;

/*
    PLAYER ACTIONS
*/

// Called when a player clicks on a room to join it
// takes that player to the lobby screen
function joinRoom(data) {
    var sock = this;

    var room = gameSocket.manager.rooms["/" + data.gameId];

    if (room !== undefined) {
        data.socketId = sock.id;
        sock.join(data.gameId);

        // Subscribe to get updates from other players when game starts
        sock.on("update", function (data) {
            sock.broadcast.to(data.gameId).emit("updated", data);
        });

        //tell other player we have joined and show on their screen
        io.sockets.to(data.gameId).emit("playerJoinedRoom", data);

        io.sockets.to(data.gameId).emit("countUp", {});

        setTimeout(function () {
            sock.emit("connected", {
                playerId: id++
            });
        }, 1500);
    } else {
        sock.emit("error", {
            message: "This room does not exist."
        });
    }
}

// Will remove them from the room and render the list of
// available rooms again.
function leaveRoom(data) {
    // Leave from room
    this.leave(data.gameId.toString());

    // Tell all players someone has left
    io.sockets.to(data.gameId).emit("playerLeftRoom", {});

    io.sockets.to(data.gameId).emit("countDown", {});

    // Render the choosing rooms screen again
}

/*
    HOST ACTIONS
*/

// Host creates a new room which people can join
// Called when create game button is pressed
function createNewGame() {
    // Create a unique Socket.IO Room
    // TODO: Increment the gameId instead of random ID/ bitmap?
    var gameId = (Math.random() * 100000) | 0;

    // Return the Room ID (gameId) and the socket ID (mySocketId)
    // to the browser client
    this.emit('newGameCreated', {
        gameId: gameId,
        socketId: this.id
    });

    // Join the Room and wait for the players
    this.join(gameId.toString());

    //maybe render lobby screen for the host

    //set listener for disconnection from this game
    io.sockets.to(gameId).on('leaveGame', leaveRoom);

    //will check if count is one less then call prepare game
    //stops functionally for joining game if too many players.
    gameSocket.emit("countUp", {});
}

// Called when there are between 2 and 4 players present.
// Stops people being able to connect to this room as it
// is removed from the list of available rooms.
// Started by button press to start game.
// Starts countdown.
function prepareGame(gameId) {
    var data = {
        socketId: this.id,
        gameId: gameId
    };

    io.sockets.to(gameId).emit('startCountdown', data);
}

// Called when the countdown finishes on the client side.
// Subscribe to get updates from other players when game starts
function startGame(gameId) {
    var data = {
        socketId: this.id,
        gameId: gameId
    };

    // Will create quintus engine for each player and render their screen
    // to the game screen html
    io.sockets.to(gameId).emit('playGame', data);

    //game html rendered in here
    //for each player the quintus engine is
    //created, a player object is create and
    //added to other players actor in room.
}


module.exports = function (socketio, socket) {
    io = socketio;
    gameSocket = socket;

    // Host Events
    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('roomFull', prepareGame);
    gameSocket.on('countdownFinished', startGame);

    // Player Events
    gameSocket.on('joinRoom', joinRoom);
};

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

//});
//
//socket.on("update", function (data) {
//    socket.broadcast.emit("updated", data);
//});

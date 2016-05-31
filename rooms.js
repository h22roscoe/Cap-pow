var io;
var gameSocket;
var id = 0;
var gameId = 0;

// Per room, think it will be moved to client side
var playerCount;

var MAX_PLAYERS = 4;
var MIN_PLAYERS = 2;

/*
    PLAYER ACTIONS
*/

// Called when a player clicks on a room to join it takes that player
// to the lobby screen
function joinRoom(data) {
    var sock = this; //socket for the player joining

    var room = gameSocket.manager.rooms["/" + data.gameId];

    if (room !== undefined) {
        data.socketId = sock.id;
        sock.join(data.gameId);

        // Subscribe to get updates from other players when game starts
        sock.on("update", function (data) {
            sock.broadcast.to(data.gameId).emit("updated", data);
        });

        //tell player we have joined and show on their screen
        io.sockets.to(data.gameId).emit("playerJoinedRoom", data);

        //can do this in player joined game function
        //        io.sockets.to(data.gameId).emit("countUp", {});

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

    //can be done in player left room
    //io.sockets.to(data.gameId).emit("countDown", {});

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

    // Return the Room ID (gameId) and the socket ID (mySocketId)
    // to the browser client
    this.emit('newGameCreated', {
        gameId: gameId++,
        socketId: this.id
    });

    // Join the Room and wait for the players
    this.join(gameId.toString());

    // Maybe render lobby screen for the host

    // Set listener for disconnection from this game
    io.sockets.to(gameId).on('leaveGame', leaveRoom);

    // Will check if count is one less then call prepare game.
    // Stops functionally for joining game if too many players.
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
    };var gameId = 0

    // Will create quintus engine for each player and render their screen
    // to the game screen html
    io.sockets.to(gameId).emit('playGame', data);

    // Game html rendered in here

    // For each player the quintus engine is created, a player object
    // is created and added to other players actor in room.
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

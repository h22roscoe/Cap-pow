var io;
var gameSocket;
var gameId = 0;

/*
    PLAYER ACTIONS
*/

// Called when a player clicks on a room to join it takes that player
// to the lobby screen
function joinRoom(data) {
    var sock = this; //socket for the player joining

    var room = gameSocket.manager.rooms['/' + data.gameId];

    if (room !== undefined) {
        data.socketId = sock.id;
        sock.join(data.gameId.toString());

        // Subscribe to get updates from other players when game starts
        sock.on("update", function (data) {
            sock.broadcast.to(data.gameId).emit("updated", data);
        });

        //tell player we have joined and show on their screen
        io.sockets.to(data.gameId).emit("playerJoinedRoom", data);

        setTimeout(function () {
            sock.emit("connected", {
                playerId: data.socketId
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
    this.broadcast.to(data.gameId).emit("playerLeftRoom", {
        playerId: data.socketId;
    });

    // Render the lobby screen again
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
    this.emit("newGameCreated", {
        gameId: gameId++,
        socketId: this.id
    });

    // Join the Room and wait for the players
    this.join(gameId.toString());

    // Maybe render game waiting screen for the host
}

// Called when there are between 2 and 4 players present.
// Stops people being able to connect to this room as it
// is removed from the list of available rooms.
// Started by button press to start game.
// Starts countdown.
// Subscribe to get updates from other players when game starts
function startGame(gameId) {
    var data = {
        socketId: this.id,
        gameId: gameId
    };

    // Will create quintus engine for each player and render their screen
    // to the game screen html
    io.sockets.to(gameId).emit("loadGame", data);

    // Game html rendered in here

    // For each player the quintus engine is created, a player object
    // is created and added to other players actor in room.
}

function stopNewJoins()

module.exports = function (socketio, socket) {
    io = socketio;
    gameSocket = socket;

    // Host Events
    gameSocket.on("createNewGame", createNewGame);
    gameSocket.on("startGame", startGame);

    // Player Events
    gameSocket.on("joinRoom", joinRoom);
    gameSocket.on("leaveRoom", leaveRoom);
};

var io;
var gameSocket;

/*
    PLAYER ACTIONS
*/

// Called when a player clicks on a room to join it takes that player
// to the lobby screen
// Roomname queried from the database and in data
function joinRoom(data) {
    var sock = this; //socket for the player joining

    var room = gameSocket.manager.rooms['/' + data.roomName];

    if (room !== undefined) {
        data.socketId = sock.id;
        data.playCount = playerCount++;
        sock.join(data.roomName);

        //tell host a player has joined so it can
        gameSocket.emit("playerJoinedRoom", data);

    } else {
        sock.emit("error", {
            message: "This room does not exist."
        });
    }
}

// Will remove them from the room and render the list of
// available rooms again.
// If last player calls this then remove this room from database.
function leaveRoom(data) {
    // Leave from room
    this.leave(data.roomName);

    // Tell all players someone has left
    this.broadcast.to(data.roomName).emit("playerLeftRoom", {
        playerId: data.socketId
    });

    // Render the lobby screen again
}

/*
    HOST ACTIONS
*/

// Host creates a new room which people can join
// Called when we have checked the room name doesn't exist.
function createNewRoom(data) {
    // Create a unique Socket.IO Room

    // Return the Room ID (gameId) and the socket ID (mySocketId)
    // to the browser client
    this.emit("newRoomCreated", {
        //The HTML will check that the roomName entered is unique, we don't worry about that here
        roomName: data.roomName,
        socketId: this.id
    });

    // Creates room, joins the room and wait for the players
    this.join(data.roomName);

    // Maybe render game waiting screen for the host
}

// Called when there are between 2 and 4 players present.
// Stops people being able to connect to this room as it
// is removed from the list of available rooms.
// Started by button press to start game.
// Starts countdown.
// Subscribe to get updates from other players when game starts
function startGame(data) {

    var data = {
        roomName: data.roomName,
        socketId: this.id
    };

    // Will create quintus engine for each player and render their screen
    // to the game screen html
    io.sockets.in(data.roomName).emit("loadGame", data);
    // Render game.ejs from the hyperlink
}

module.exports = function (socketio, socket) {
    io = socketio;
    gameSocket = socket;

    // Host Events
    //Emitted when the create button is pressed, will call this function and then redirect to 'in lobby' page
    gameSocket.on("createNewRoom", createNewRoom);
    //Emitted when start button pressed (this only shows to host when they are in lobby), calls function and then redirects to game
    gameSocket.on("startGame", startGame);

    // Player Events
    gameSocket.on("joinRoom", joinRoom);
    gameSocket.on("leaveRoom", leaveRoom);
};

var roomSocket;
var playerCount = 0;
var MAX_PLAYERS = 4;
var MIN_PLAYERS = 2;

//splits these both into rooms using roomName


/*
    PLAYER ACTIONS
*/

// Called when a player clicks on a room to join it takes that player
// to the lobby screen
// Roomname queried from the database and in data
// Maybe pass in the player name to render on the screen.
function joinRoom(data) {
    // Socket for the player joining room (would be in room nsp)
    var sock = this;

    if (playerCount < MAX_PLAYERS) {
        playerCount++;
        sock.join(data.roomName);
        //tell host a player has joined so it can
        roomNsp.in(data.roomName).emit("playerJoinedRoom", {});
    } else {
        //stop being allowed to add players
    }

}

// Will remove them from the room and render the list of
// available rooms again.
// If last player calls this then remove this room from database.
function leaveRoom(data) {
    // Leave from room
    this.leave(data.roomName);

    // Tell all players someone has left
    if (playerCount !== 1) {
        this.broadcast.to(data.roomName).emit("playerLeftRoom", {});
    } else {
        //don't need to broadcast as no one in room, remove room from db
    }
    // Render the lobby screen again
}

/*
    HOST ACTIONS
*/

// Host creates a new room which people can join
// Called when we have checked the room name doesn't exist.
function createNewRoom(data) {
    // Create a unique Socket.IO Room

    // Return the Room ID (gameId)
    // to the browser client
    this.emit("joinedRoom", {
        //The HTML will check that the roomName entered is unique, we don't worry about that here
        roomName: data.roomName,
    });

    // Creates room, joins the room and wait for the players
    this.join(data.roomName);

    // Maybe render game waiting screen for the host
}

// Called when there are between 2 and 4 players present.
// Stops people being able to connect to this room as it
// is removed from the list of available rooms.
// Started by button press to start countdown.
function startCountDown(data) {

    //this function may be able to be put straight into the button event
    var time = 5;
    while (time >= 0) {

        var id = setTimeout(function () {
            roomSocket.to.(data.roomName).emit("countDown", {
                time: time--
            });
        }, 1000);
    };


        // Will create quintus engine for each player and render their screen
        // to the game screen html or put a start game button which links to game
}

module.exports = function (roomio, roomSocket) {
    roomNsp = roomio;
    roomSocket = roomSocket;

    // Host Events
    //Emitted when the create button is pressed, will call this function and then redirect to 'in lobby' page
    roomSocket.on("createNewRoom", createNewRoom);
    //Emitted when start button pressed (this only shows to host when they are in lobby), calls function and then redirects to game
    roomSocket.on("countDownNow", startCountDown);

    // Player Events
    roomSocket.on("joinRoom", joinRoom);
    roomSocket.on("leaveRoom", leaveRoom);

};

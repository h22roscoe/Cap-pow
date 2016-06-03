// Global variables set at the bottom
var roomSocket;
var currentRoom;

// Called when a player clicks on a room to join it takes that player
// to the lobby screen
function joinRoom(data) {
    // Socket for the player joining room
    this.join(data.roomName);
    currentRoom = data.roomName;
}

// Called when there are between 2 and 4 players present.
// Stops people being able to connect to this room as it
// is removed from the list of available rooms.
// Started by button press to start countdown.
function startCountdown(data) {

    //this function may be able to be put straight into the button event
    var time = 5;
    var id = setInterval(function () {
        roomNsp.to(data.roomName).emit("countdown", {
            time: time--
        });

        if (time < 0) {
            clearInterval(id);
        }
    }, 1000);
}

function sendHeartbeat(){
    roomNsp.emit('ping', { beat : 1 });
    setTimeout(sendHeartbeat, 8000);
}

module.exports = function (username, roomio, models, roomSocket) {
    roomNsp = roomio;
    roomSocket = roomSocket;

    // Host Events
    // Emitted when start button pressed
    //  (this only shows to host when they are in lobby),
    //  calls function and then redirects to game
    roomSocket.on("countdown", startCountdown);

    // Player Events
    roomSocket.on("joinRoom", joinRoom);

    roomSocket.on('pong', function(data){
        console.log("Pong received from client");
    });

    setTimeout(sendHeartbeat, 8000);

    roomSocket.on("disconnect", function () {
        console.log("Setup: A user disconnected");

        roomSocket.leave(currentRoom);

        if (playerCount <= 0) {
            models.room.destroy({
                where: {
                    id: currentRoom
                }
            });
        } else {
            models.room.update({
                players: models.sequelize.literal("players - 1")
            }, {
                where: {
                    id: currentRoom
                }
            });
        }
    });
};

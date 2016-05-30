var io;
var gameSocket;
var id = 0;
var playerCount; //per room, think it will be moved to client side
const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;

exports.startApp = function (socketIO, socket) {
    io = socketIO;
    gameSocket = socket;

    // gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('roomFull', prepareGame);
    gameSocket.on('countdownFinished', startGame);

    // Player Events
    gameSocket.on('joinRoom', joinRoom);
    gameSocket.on('leaveRoom', leaveRoom);
}

/*
    HOST ACTIONS
*/


// host creates a new room which people can join
// called when create game button is pressed
function createNewGame() {
    // Create a unique Socket.IO Room
    //TODO: Increment the gameId instead of random ID/ bitmap?
    var gameId = (Math.random() * 100000) | 0;

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {
        gameId: gameId,
        socketId: this.id
    });

    // Join the Room and wait for the players
    this.join(gameId.toString());

    //maybe render lobby screen for the host

    //set listener for disconnection from this game
    io.sockets.in(gameId).on('leaveGame', playerLeaves);

    //will check if count is one less then call prepare game
    //stops functionally for joining game if too many players.
    gameSocket.emit("countUp", {});
}

//Called when there are between 2 and 4 players present.
//Stops people being able to connect to this room as it
//is removed from the list of available rooms.
//Started by button press to start game.
//Starts countdown.
function prepareGame(gameId) {
    var data = {
        socketId: this.id,
        gameId: gameId
    };

    io.sockets.in(gameId).emit('startCountdown', data);
}

//Called when the countdown finishes on the client side.
function startGame(gameId) {
//    console.log('Game Started.');

    var data = {
        socketId: this.id,
        gameId: gameId
    };

    //Will create quintus engine for each player and render their screen to the game
    //screen html
    io.sockets.in(gameId).emit('playGame', data);

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
function joinRoom(data) {
    var room = gameSocket.manager.rooms["/" + data.gameId];

    if (room != undefined) {
        data.socketId = this.id;
        this.join(data.gameId);

        //subscribe to get updates from other players when game starts


        //tell other player we have joined and show on their screen
        io.sockets.in(data.gameId).emit('playerJoinedRoom', data);

        io.sockets.in(data.gameId).emit("countUp", {});

        setTimeout(function () {
            this.emit('connected', {playerId: id++});
        }
    } else {
        this.emit('error', {
            message: "This room does not exist."
        });
    }
}

//will remove them from the room and render the list of
//available rooms again.
function leaveRoom(gameId) {

    // leave from room
    this.leave(game.toString());

    //tell all players someone has left
    io.sockets.in(gameId).emit("playerLeftRoom", {});

    io.sockets.in(data.gameId).emit("countDown", {});
    //render the choosing rooms screen again
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

//});
//
//socket.on("update", function (data) {
//    socket.broadcast.emit("updated", data);
//});

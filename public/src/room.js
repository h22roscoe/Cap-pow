var Room = {
    init: function () {
        //Room.socket = io.sockets.connected[sessionStorage.getItem("socketId")];
        Room.socket = io.connect(https://localhost/8080);
        Room.setupListeners();
    },

    setupListeners: function () {
        Room.socket.on("playerLeftRoom", Room.playerLeftRoom);
        Room.socket.on("playerJoinedRoom", Room.playerJoinedRoom);
        Room.socket.on("countDown".Room.countDown);

        //For Testing
        Room.socket.broadcast.emit("startGame");
    },


    playerJoinedRoom: function (data) {
        //update the room screen with the new number of players
        //update the room screen with another username
    },

    leaveRoom: function (data) {
        //update the room screen with the new number of players
        //update the room screen with another username
    },

    countDown: function (data) {
        //Change timer value on document using data.timerValue

    }
}

Room.init();



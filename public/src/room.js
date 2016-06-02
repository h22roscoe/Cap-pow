var Room = {
    init: function () {
        Room.socket = io.connect("/room");
        Room.setupListeners();
        Room.socket.emit("joinRoom", {
            roomName: sessionStorage.getItem("roomName")
        });
    },

    setupListeners: function () {
        Room.socket.on("playerLeftRoom", Room.playerLeftRoom);
        Room.socket.on("playerJoinedRoom", Room.playerJoinedRoom);
        Room.socket.on("countDown", Room.countDown);
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



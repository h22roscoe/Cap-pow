var IO = {

    //MAY PUT BUTTON CLICK LISTENERS IN HERE

    init: function () {

        IO.room;
        // Connecting locally but will connect to herokuapp eventually
        IO.socket = io.connect("http://localhost:8080");
        IO.setupListeners();

        IO.MAX_PLAYERS = 4;
        IO.MIN_PLAYERS = 2;
        IO.players = 0;
    },

    setupListeners: function () {
        IO.socket.on("newRoomCreated", IO.createNewRoom);
        IO.socket.on("playerLeftRoom", IO.playerLeftRoom);
        IO.socket.on("playerJoinedRoom", IO.playerJoinedRoom);


        //For Testing
        IO.socket.broadcast.emit("startGame");
    },

    createNewRoom: function (data) {
        IO.players++;
        IO.room = data.room;
    },

    playerJoinedRoom: function (data) {
        if (IO.players < IO.MAX_PLAYERS) {
            data.playerCount = ++IO.players;
            //Change player count on screen
            io.sockets.in(data.room).emit("updateWaitingScreen", data);
        } else {

        }
    },

    playerLeftRoom: function (data) {
        // Change player count on screen
        // Player who left: data.playerId;
        // Change player count on screen
        data.playerCount = --IO.players;
        // Change player count on screen
        io.sockets.in(data.room).emit("updateWaitingScreen", data);
    },
}

IO.init();

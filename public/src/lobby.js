var IO = {
    init: function () {
        // Connecting locally but will connect to herokuapp eventually
        IO.socket = io.connect("http://localhost:8080")
        IO.setupListeners();

        IO.MAX_PLAYERS = 4;
        IO.MIN_PLAYERS = 2;
        IO.players = 0;
    },

    setupListeners: function () {
        IO.socket.on("newGameCreated", IO.createNewRoom);
        IO.socket.on("playerLeftRoom", IO.playerLeftRoom);
        IO.socket.on("playerJoinedRoom", IO.playerJoinedRoom);
        IO.socket.on("loadGame", IO.loadGame);

        IO.socket.broadcast.emit("startGame");
    },

    newGameCreated: function () {

    },

    playerLeftRoom: function (data) {
        // Player who left: data.playerId;
    }
}

IO.init();

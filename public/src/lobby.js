var IO = {

    //MAY PUT BUTTON CLICK LISTENERS IN HERE

    init: function () {
        // Connecting locally but will connect to herokuapp eventually
        // Store socket Id for other client files to access
        IO.socket = io.connect("http://localhost:8080");
        sessionStorage.setItem("socketId", IO.socket.id).

    },

    setupListeners: function () {
        IO.socket.on("joinedRoom", IO.joinRoom);
    },

    joinRoom: function (data) {
        sessionStorage.setItem(room, data.room);
        //will render the waiting screen
    }
}

IO.init();

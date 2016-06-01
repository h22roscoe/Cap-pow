var Lobby = {
    //MAY PUT BUTTON CLICK LISTENERS IN HERE
    init: function () {
        // Connecting locally but will connect to herokuapp eventually
        // Store socket Id for other client files to access
        Lobby.socket = io.connect("http://localhost:8080");

        // May need to decycle to store the object itself (not id)
        var cache = [];

        sessionStorage.setItem("socket", JSON.stringify(Lobby.socket,
                                   function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }

                // Store value in our collection
                cache.push(value);
            }

            return value;
        }));
    },

    setupListeners: function () {
        Lobby.socket.on("joinedRoom", Lobby.joinRoom);
    },

    joinRoom: function (data) {
        sessionStorage.setItem(room, data.room);
        //will render the waiting screen

        while (true) {
            console.log("hi");
        }
    }
}

Lobby.init();

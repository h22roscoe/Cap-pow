var Room = {
    init: function () {
        Room.socket = io.connect("/room");
        Room.socket.on("countDown", Room.countDown);
        Room.socket.emit("joinRoom", {
            roomName: sessionStorage.getItem("roomName")
        });

        Room.socket.on('ping', function (data) {
            Room.socket.emit('pong', {
                beat: 1
            });
        });
    },

    countDown: function (data) {
        //Change timer value on document using data.time
        if (data.time) {
            // Prefer this to be a pop up box at some point
            $("#count").text(data.time + " seconds to go!");
        } else {
            window.document.location = "/game";
        }
    }
}

Room.init();

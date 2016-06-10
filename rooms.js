module.exports = function (roomNsp, models, roomData, roomSocket) {
    disconnected = true;
    var currentRoom;

    // Host Events
    // Emitted when start button pressed
    //  (this only shows to host when they are in lobby),
    //  calls function and then redirects to game
    roomSocket.on("countdown", function (data) {
        disconnected = false;
        var time = 5;
        var id = setInterval(function () {
            roomNsp.to(data.roomName).emit("countdown", {
                time: time--
            });

            if (time < 0) {
                clearInterval(id);
            }
        }, 1000);
    });

    // Player Events
    roomSocket.on("joinRoom", function (data) {
        var socket = this;

        models.room.update({
            players: models.sequelize.literal("players + 1")
        }, {
            where: {
                id: data.roomName
            }
        });

        models.room.find({
            where: {
                id: data.roomName
            }
        }).then(function (rooms) {
            roomData.joinRoom(socket, {
                name: data.playerName,
                id: rooms.players
            }, data.roomName);
        });

        currentRoom = data.roomName;
    });

    roomSocket.on('pong', function(data){
        console.log("Pong received from client");
    });

    var sendHeartbeat = function () {
        roomNsp.emit('ping', { beat : 1 });
        setTimeout(sendHeartbeat, 8000);
    }

    setTimeout(sendHeartbeat, 8000);

    roomSocket.on("disconnect", function () {
        console.log("Setup: A user disconnected");

        models.room.update({
            players: models.sequelize.literal("players - 1")
        }, {
            where: {
                id: currentRoom
            }
        }).then(function () {
            models.room.find({
                where: {
                    id: currentRoom
                }
            }).then(function(room) {
                console.log(room.players);
                if (room.players <= 0) {
                    models.room.destroy({
                        where: {
                            id: currentRoom
                        }
                    });
                }
            })
        });

        if (disconnected) {
            roomData.leaveRoom(roomSocket);
        }
    });
};

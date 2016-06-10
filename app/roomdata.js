exports.Debug = false;

exports.rooms = {};

exports.roomExists = function(room) {
    if (!this.rooms[room]) return false;
    return true;
};

exports.createRoom = function(socket, user, room) {
    if (exports.Debug) console.log(socket.id + ": Creating Room: " + room);
    this.rooms[room] = {
        owner: user,
        users: [],
        variables: {}
    };
}

exports.set = function(socket, variable, content) {
    if (exports.Debug) {
        console.log(socket.id + ": Creating variable: " + variable + " with content: " + content);
    }

    if (!this.roomExists(socket.roomdata_room)) {
        console.error("You have tried setting a room variable but this socket is not in any room!");
        return false;
    }
    this.rooms[socket.roomdata_room].variables[variable] = content;
}

exports.get = function(socket, variable) {
    if (exports.Debug) {
        console.log(socket.id + ": Getting variable: " + variable);
    }

    if (variable == "room") {
        if (!socket.roomdata_room) return undefined;
        return socket.roomdata_room;
    }

    if (!this.roomExists(socket.roomdata_room)) {
        console.error("You have tried getting a room variable but this socket is not in any room!");
        return undefined;
    }

    if (variable === "owner") return this.rooms[socket.roomdata_room].owner

    if (variable === "users") return this.rooms[socket.roomdata_room].users

    return this.rooms[socket.roomdata_room].variables[variable];
}

exports.rejoinRoom = function(socket, room) {
    socket.join(room);
    socket.roomdata_room = room;
}

exports.joinRoom = function(socket, user, room) {
    if (exports.Debug) {
        console.log(username + ": Joining room: " + room);
    }

    if (socket.roomdata_room) {
        this.leaveRoom(socket, room);
    }

    if (!this.roomExists(room)) {
        this.createRoom(socket, user, room)
    }
    
    this.rooms[room].users.push(user);
    socket.join(room);
    socket.roomdata_room = room;
};

exports.clearRoom = function(room) {
    delete this.rooms[room];
};

exports.clearUsers = function(socket) {
    this.rooms[socket.roomdata_room].users = [];
}

exports.leaveRoom = function(socket) {
    var room = socket.roomdata_room;

    if (socket.roomdata_room === undefined) {
        throw new Error("socket id:" + socket.id + " is not in a room!");
    }

    if (exports.Debug) {
        console.log(socket.id + ": Leaving room: " + socket.roomdata_room);
    }

    var i = this.rooms[socket.roomdata_room].users.indexOf(socket.id);
    if (i != -1) this.rooms[socket.roomdata_room].users.splice(i, 1);

    socket.leave(socket.roomdata_room);

    if (this.rooms[room].users.length === 0) {
        this.clearRoom(room);
    }
}

exports.getPlayerNumber = function(socket, name) {
    var roomUsers = this.rooms[socket.roomdata_room].users;
    for (i = 0; i < roomUsers.length; i++) {
        if (roomUsers[i].name === name) {
            return roomUsers[i].id;
        }
    }
}

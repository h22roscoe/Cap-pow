// Put all code in here except what happens to players when it is collected
Quintus.Powerup = function (Q) {
    Q.Sprite.extend("Powerup", {
        init: function (p) {
            this._super(p, {
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0
            });

            // Call sensor() when powerup is hit
            this.on("sensor");
        },

        //THIS sensor() WONT ACTUALLY BE CALLED, AS WE ALWAYS USE A CONCRETE POWERUP BELOW
        // When a powerup is hit
        // colObj will be the Player that collided with the powerup
        sensor: function (colObj) {
            // Destroy the powerup as it has been collected
            this.destroy();
        }
    });

    //TODO: Need all sheets for each powerup compiled etc
    Q.Powerup.extend("Slow", {
        init: function (p) {
            //Concrete implementation of a Q.Powerup
            this._super(p, {
                sheet: "slowPowerup"
            });
        },

        //When a slow powerup is hit (Called instead of sensor() in Powerup)
        sensor: function (colObj) {
            //Tell every other player in the room that they should equip a slow component, emitting the id of
            //the player who collided with the powerup, so that we can  tell the other players who activated the powerup
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("slow", {
                playerId: colObj.p.playerId
            });
            //Destroy the powerup sprite as it has been collected
            this.destroy();
        }
    });

    Q.Powerup.extend("Fast", {
        init: function (p) {
            this._super(p, {
                sheet: "fastPowerup"
            });
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("fast", {
                playerId: colObj.p.playerId
            });
            this.destroy();
        }
    });

    Q.Powerup.extend("Heavy", {
        init: function (p) {
            this._super(p, {
                sheet: "heavyPowerup"
            });
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("heavy", {
                playerId: colObj.p.playerId
            });
            this.destroy();
        }
    });

    Q.Powerup.extend("Light", {
        init: function (p) {
            this._super(p, {
                sheet: "lightPowerup"
            });
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("light", {
                playerId: colObj.p.playerId
            });
            this.destroy();
        }
    });

    Q.Powerup.extend("Freeze", {
        init: function (p) {
            this._super(p, {
                sheet: "freezePowerup"
            });
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("freeze", {
                playerId: colObj.p.playerId
            });
            this.destroy();
        }
    });

}

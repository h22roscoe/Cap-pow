Quintus.Powerup = function (Q) {
    var slowId = 0;
    var fastId = 0;
    var heavyId = 0;
    var lightId = 0;
    var freezeId = 0;

    Q.Sprite.extend("Slow", {
        init: function (p) {
            this._super(p, {
                sheet: "red",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_NONE,
                sensor: true,
                gravity: 0,
                powerupId: ++slowId
            });

            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            console.log("Should emit slow");

            colObj.p.socket.emit("powerUp", {
                name: "Slow",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Slow", {
        added: function () {
<<<<<<< HEAD
            this.entity.p.speed -= 300;
=======
            // Slow the player down to half speed as soon as component is added
            // Doing this, rather than set speed to 50, allows us to stack components on a player
            this.entity.p.speed = this.entity.p.speed / 2;
            //Will last for 5 seconds (60 frames per second)
>>>>>>> origin/endgame
            this.timeLeft = 10 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
<<<<<<< HEAD
            if (this.timeLeft === 0) {
                this.entity.p.speed += 300;
                this.entity.del("Slow");
=======
            //If the player has had this component for long enough
            if (this.timeLeft == 0) {
                //Double the players speed back to what it would have been without this powerup
                this.entity.p.speed = this.entity.p.speed * 2;
                // this.entity.off("step", this, "step");
                this.entity.del("slow");
>>>>>>> origin/endgame
            } else {
                this.timeLeft--;
            }
        }
    });

    Q.Sprite.extend("Fast", {
        init: function (p) {
            this._super(p, {
                sheet: "green",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0,
                powerupId: ++fastId
            });

            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Fast",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Fast", {
        added: function () {
            this.entity.p.speed += 300;
            this.timeLeft = 10 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft === 0) {
                this.entity.p.speed -= 300;
                this.entity.del("Fast");
            } else {
                this.timeLeft--;
            }
        }
    });

    Q.Sprite.extend("Heavy", {
        init: function (p) {
            this._super(p, {
                sheet: "darkBlue",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0,
                powerupId: ++heavyId
            });

            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Heavy",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Heavy", {
        added: function () {
            //Double the player's gravity
            this.entity.p.gravity = this.entity.p.gravity * 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft === 0) {
                this.entity.p.gravity = this.entity.p.gravity / 2;
                // this.entity.off("step", this, "step");
                this.entity.del("Heavy");
            } else {
                this.timeLeft--;
            }
        }
    });

    Q.Sprite.extend("Light", {
        init: function (p) {
            this._super(p, {
                sheet: "yellow",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0,
                powerupId: ++lightId
            });

            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Light",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Light", {
        added: function () {
            this.entity.p.gravity /= 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft === 0) {
                this.entity.p.gravity *= 2;
                this.entity.del("Light");
            } else {
                this.timeLeft--;
            }
        }
    });

    Q.Sprite.extend("Freeze", {
        init: function (p) {
            this._super(p, {
                sheet: "lightBlue",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0,
                powerupId: ++freezeId
            });

            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Freeze",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Freeze", {
        added: function () {
            this.entity.p.vx = 0;
            this.entity.p.vy = 0;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            // If the player tries to move, set it's velocity to 0
            this.entity.p.direction = Q.inputs['left'] ? 'left' :
                Q.inputs['right'] ? 'right' :
                Q.inputs['up'] ? 'up' :
                Q.inputs['down'] ? 'down' : this.entity.p.direction;

            switch (this.entity.p.direction) {
                case "left":
                case "right":
                case "up":
                case "down":
                    this.entity.p.vx = 0;
                    this.entity.p.vy = 0;
                    break;
            }

            if (this.timeLeft === 0) {
                this.entity.del("Freeze");
            } else {
                this.timeLeft--;
            }
        }
    });
<<<<<<< HEAD
=======

  /*  Q.Sprite.extend("FlagMove", {
        init: function (p) {
            this._super(p, {
                sheet: "White",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0
            });

            this.on("sensor");
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("flag", {
                playerId: colObj.p.playerId,

            });
            this.destroy();
        }
    });  */

>>>>>>> origin/endgame
}

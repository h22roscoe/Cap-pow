// Put all code in here except what happens to players when it is collected
Quintus.Powerup = function (Q) {

    Q.Sprite.extend("Slow", {
        init: function (p) {
            //Concrete implementation of a Q.Powerup
            this._super(p, {
                sheet: "red",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_NONE,
                sensor: true,
                gravity: 0
            });
            //Call sensor() when powerup is hit
            this.on("sensor");
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

    Q.component("slow", {

        //this.entity is the player holding the component (do this.entity.p.speed to access the player's speed, etc)

        //Called when player.add("slow") happens
        added: function () {
            // Slow the player down to half speed as soon as component is added
            // Doing this, rather than set speed to 50, allows us to stack components on a player
            this.entity.p.speed -= 300;
            //Will last for 5 seconds (60 frames per second)
            this.timeLeft = 10 * 60;
            //Whenever the entity steps, this component's step function will be called too
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            //If the player has had this component for long enough
            if (this.timeLeft == 0) {
                //Double the players speed back to what it would have been without this powerup
                this.entity.p.speed += 300;
                // this.entity.off("step", this, "step");
                this.entity.p.del("slow");
            } else {
                timeLeft--;
            }
        }

        //Can add any other functions here that you might want to player.slow.function() on (Gun example is refillAmmo())

        //Can extend the player to have some more functions while this component is equipped (Gun example is fire())
    });

    Q.Sprite.extend("Fast", {
        init: function (p) {
            this._super(p, {
                sheet: "green",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0
            });
            console.log("Binding sensor");
            this.on("sensor");
            /*this.on("hit.sprite", function (collision) {
                console.log("HIT");
                if (collision.obj.isA("Player")) {
                    collision.obj.p.socket.broadcast.to(colObj.p.roomName).emit("fast", {
                        playerId: colObj.p.playerId
                    });
                    this.destroy();
                }
            });*/
            this.add("2d");
        },

        sensor: function (colObj) {
            //console.log(colObj.p);
            //console.log(colObj.p.socket.broadcast);
            //colObj.p.socket.broadcast.to(colObj.p.roomName).emit("fast", {
            colObj.p.socket.emit("fast", {
                playerId: colObj.p.playerId
            });
            this.destroy();
        }
    });

    Q.component("fast", {

        added: function () {
            // Double the players speed
            this.entity.p.speed += 300;
            this.timeLeft = 10 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft == 0) {
                this.entity.p.speed -= 300;
                // this.entity.off("step", this, "step");
                this.entity.p.del("fast");
            } else {
                timeLeft--;
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
                gravity: 0
            });

            this.on("sensor");
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("heavy", {
                playerId: colObj.p.playerId
            });
            this.destroy();
        }
    });

    Q.component("heavy", {

        added: function () {
            //Double the player's gravity
            this.entity.p.gravity = this.entity.p.gravity * 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft == 0) {
                this.entity.p.gravity = this.entity.p.gravity / 2;
                // this.entity.off("step", this, "step");
                this.entity.p.del("heavy");
            } else {
                timeLeft--;
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
                gravity: 0
            });

            this.on("sensor");
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("light", {
                playerId: colObj.p.playerId
            });
            this.destroy();
        }
    });

    Q.component("light", {

        added: function () {
            //Double the player's gravity
            this.entity.p.gravity = this.entity.p.gravity / 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft == 0) {
                this.entity.p.gravity = this.entity.p.gravity * 2;
                // this.entity.off("step", this, "step");
                this.entity.p.del("light");
            } else {
                timeLeft--;
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
                gravity: 0
            });

            this.on("sensor");
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("freeze", {
                playerId: colObj.p.playerId
            });
            this.destroy();
        }
    });

    Q.component("freeze", {

        added: function () {
            //Make velocity of player 0 as soon as they receive powerup
            p.vx = 0;
            p.vy = 0;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {

            //If the player tries to move, set it's velocity to 0

            this.entity.p.direction = Q.inputs['left'] ? 'left' :
                Q.inputs['right'] ? 'right' :
                Q.inputs['up'] ? 'up' :
                Q.inputs['down'] ? 'down' : this.entity.p.direction;

            switch (this.entity.p.direction) {
                case "left":
                case "right":
                case "up":
                case "down":
                    p.vx = 0;
                    p.vy = 0;
                    break;

            }
            if (this.timeLeft == 0) {
                // this.entity.off("step", this, "step");
                this.entity.p.del("freeze");
            } else {
                timeLeft--;
            }
        }

    });

}

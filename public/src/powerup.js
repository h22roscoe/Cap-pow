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
                colObj.p.playerId
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
            this.entity.p.speed = this.entity.p.speed / 2;
            //Will last for 5 seconds (60 frames per second)
            this.timeLeft = 5 * 60;
            //Whenever the entity steps, this component's step function will be called too
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            //If the player has had this component for long enough
            if (this.timeLeft == 0) {
                //Double the players speed back to what it would have been without this powerup
                this.entity.p.speed = this.entity.p.speed * 2;
                this.entity.off("step", this, "step");
                this.entity.p.del("slow");
            } else {
                timeLeft--;
            }
        }

        //Can add any other functions here that you might want to player.slow.function() on (Gun example is refillAmmo())

        //Can extend the player to have some more functions while this component is equipped (Gun example is fire())
    });

    Q.Powerup.extend("Fast", {
        init: function (p) {
            this._super(p, {
                sheet: "fastPowerup"
            });
        },

        sensor: function (colObj) {
            colObj.p.socket.broadcast.to(colObj.p.roomName).emit("fast", {
                colObj.p.playerId
            });
            this.destroy();
        }
    });

    Q.component("fast", {

        added: function () {
            // Double the players speed
            this.entity.p.speed = this.entity.p.speed * 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft == 0) {
                this.entity.p.speed = this.entity.p.speed / 2;
                this.entity.off("step", this, "step");
                this.entity.p.del("fast");
            } else {
                timeLeft--;
            }
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
                colObj.p.playerId
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
                this.entity.off("step", this, "step");
                this.entity.p.del("heavy");
            } else {
                timeLeft--;
            }
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
                colObj.p.playerId
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
                this.entity.off("step", this, "step");
                this.entity.p.del("light");
            } else {
                timeLeft--;
            }
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
                colObj.p.playerId
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
                this.entity.off("step", this, "step");
                this.entity.p.del("freeze");
            } else {
                timeLeft--;
            }
        }

    });

}

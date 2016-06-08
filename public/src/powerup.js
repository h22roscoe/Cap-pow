// Put all code in here except what happens to players when it is collected
Quintus.Powerup = function (Q) {
    var slowId = 0;
    var fastId = 0;
    var heavyId = 0;
    var lightId = 0;
    var freezeId = 0;

    Q.Sprite.extend("Slow", {
        init: function (p) {
            // Concrete implementation of a Q.Powerup
            this._super(p, {
                sheet: "red",
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_NONE,
                sensor: true,
                gravity: 0,
                id: ++slowId
            });
            // Call sensor() when powerup is hit
            this.on("sensor");
            this.add("2d");
        },

        //When a slow powerup is hit (Called instead of sensor() in Powerup)
        sensor: function (colObj) {
            //Tell every other player in the room that they should equip a slow component, emitting the id of
            colObj.p.socket.emit("powerUp", {
                name: "Slow",
                playerId: colObj.p.playerId,
                id: this.p.id,
                x: this.p.x,
                y: this.p.y
            });
            this.destroy();
        }
    });

    Q.component("Slow", {
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
                this.entity.del("Slow");
            } else {
                this.timeLeft--;
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
                gravity: 0,
                id: ++fastId
            });
            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Fast",
                playerId: colObj.p.playerId,
                id: this.p.id,
                x: this.p.x,
                y: this.p.y
            });
            this.destroy();
        }
    });

    Q.component("Fast", {

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
                id: ++heavyId
            });
            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Heavy",
                playerId: colObj.p.playerId,
                id: this.p.id,
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
            if (this.timeLeft == 0) {
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
                id: ++lightId
            });

            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Light",
                playerId: colObj.p.playerId,
                id: this.p.id,
                x: this.p.x,
                y: this.p.y
            });
            this.destroy();
        }
    });

    Q.component("Light", {

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
                id: freezeId
            });

            this.on("sensor");
            this.add("2d");
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Freeze",
                playerId: colObj.p.playerId,
                id: this.p.id,
                x: this.p.x,
                y: this.p.y
            });
            this.destroy();
        }
    });

    Q.component("Freeze", {

        added: function () {
            //Make velocity of player 0 as soon as they receive powerup
            this.entity.p.vx = 0;
            this.entity.p.vy = 0;
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
                this.entity.del("Freeze");
            } else {
                this.timeLeft--;
            }
        }

    });

}

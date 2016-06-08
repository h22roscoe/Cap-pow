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
            // TODO: Add the component which represents this power up?

            // Destroy the powerup as it has been collected
            this.destroy();
        }
    });


    //TODO: Need all sheets for each powerup compiled etc
    Q.Powerup.extend("Slow", {
        init: function (p) {
            this._super(p, {
                sheet: "slowPowerup"
            });
        },

        //When a slow powerup is hit (Called instead of sensor() in Powerup)
        sensor: function (colObj) {
            //Make every player slow and make colObj normal speed again
            //OR
            //Just make every other player slow in one socket emit/broadcast
            //BEST IDEA SEEMS TO BE JUST DO player.add("slow") FOR EVERY OTHER PLAYER
            this.destroy();
        }
    });

    Q.Powerup.extend("Fast", {
        init: function (p) {
            this._super(p, {
                sheet: "fastPowerup"
            });
        },

        // When a slow powerup is hit (Called instead of sensor() in Powerup)
        sensor: function (colObj) {
            // Make every player fast and make colObj normal speed again
            // OR
            // Just make every other player fast in one socket emit/broadcast
            //BEST IDEA SEEMS TO BE JUST DO player.add("fast") FOR EVERY OTHER PLAYER
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
            //Give every other player the component
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
            //Give every other player the component
            this.destroy();
        }
    });

}

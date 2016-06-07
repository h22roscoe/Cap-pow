// Put all code in here except what happens to players when it is collected
Q.Powerup = function(Q) {
    Q.Sprite.extend("Powerup", {
        init: function(p) {
            this._super(p, {
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0
            });

            // Call sensor() when powerup is hit
            this.on("sensor");
        },

        // When a powerup is hit
        // colObj will be the Player that collided with the powerup
        sensor: function(colObj) {
            // TODO: Add the component which represents this power up?

            // Destroy the powerup as it has been collected
            this.destroy();
        }
    });


    //TODO: Need all sheets for each powerup compiled etc
    Q.Powerup.extend("Slow", {
        init: function(p) {
            this._super(p, {
                sheet: "slow"
            });
        },

        //When a slow powerup is hit (Called instead of sensor() in Powerup)
        sensor: function(colObj) {
            //Make every player slow and make colObj normal speed again
            //OR
            //Just make every other player slow in one socket emit/broadcast
            this.destroy();
        }
    });

    Q.Powerup.extend("Fast", {
        init: function(p) {
            this._super(p, {
                sheet: "fast"
            });
        },

        // When a slow powerup is hit (Called instead of sensor() in Powerup)
        sensor: function(colObj) {
            // Make every player fast and make colObj normal speed again
            // OR
            // Just make every other player fast in one socket emit/broadcast
            this.destroy();
        }
    });
}

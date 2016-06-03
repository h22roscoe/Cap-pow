// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
Q.Sprite.extend("Player", {
    // the init constructor is called on creation
    init: function (p) {
        // You can call the parent's constructor with this._super(..)
        this._super(p, {
            sheet: "player",
            // Setting a sprite sheet sets sprite width
            // and height
            type: Q.SPRITE_PLAYER,
            // TODO: Need to change collisionMask so that players dont collide
            // with each other
            gamePoints: 0
        });

        // Add in pre-made components to get up and running quickly
        // The `2d` component adds in default 2d collision detection
        // and kinetics (velocity, gravity)
        // The `platformerControls` makes the player controllable by the
        // default input actions (left, right to move,  up or action to jump)
        // It also checks to make sure the player is on a horizontal
        // surface before letting them jump.
        this.add("2d, platformerControls, animation");
    },

    //TODO: Add event driven stuff (Collisions, down to go through door, etc)
    step: function (dt) {
        socket.emit("update", {
            playerId: this.p.playerId,
            x: this.p.x,
            y: this.p.y,
            sheet: this.p.sheet,
            gamePoints: this.p.gamePoints
        });

        UiScore.innerHTML = "Score: " + this.p.gamePoints;
    }
});

Q.Sprite.extend("Actor", {
    init: function (p) {
        this._super(p, {
            update: true,
            collisionMask: Q.SPRITE_DEFAULT
        });

        var temp = this;

        // This interval method will destroy an actor when it disconnects
        // after 3 seconds
        setInterval(function () {
            if (!temp.p.update) {
                for (i = 0 ; i < actors.length; i++) {
                    if (actors[i].player.p.playerId === temp.p.playerId) {
                        actors.splice(i, 1);
                    }
                }

                temp.destroy();
            }

            temp.p.update = false;
        }, 30000);
    }
});

Quintus.Player = function(Q) {
    // The very basic player sprite, this is just a normal sprite
    // using the player sprite sheet with default controls added to it.
    Q.Sprite.extend("Player", {
        // the init constructor is called on creation
        init: function(p) {
            // You can call the parent's constructor with this._super(..)
            this._super(p, {
                sheet: "player",
                // Setting a sprite sheet sets sprite width
                // and height
                type: Q.SPRITE_PLAYER,
                // TODO: Need to change collisionMask so that players
                // dont collide with each other
                jumpSpeed: -300,
                speed: 100,
                gamePoints: 0
            });

            this.add("2d, platformerControls, animation");
        },

        step: function(dt) {
            this.p.socket.emit("update", {
                playerId: this.p.playerId,
                x: this.p.x,
                y: this.p.y,
                sheet: this.p.sheet
            });
        }
    });

    Q.Sprite.extend("Actor", {
        init: function(p) {
            this._super(p, {
                update: true,
                collisionMask: Q.SPRITE_DEFAULT
            });

            var temp = this;

            // This interval method will destroy an actor when it disconnects
            // after 30 seconds
            setInterval(function() {
                if (!temp.p.update) {
                    for (i = 0; i < actors.length; i++) {
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
}

// ## Player Sprite
// The very basic player sprite, this is just a normal sprite
// using the player sprite sheet with default controls added to it.
require([], function () {
    Q.Sprite.extend("Player", {

        // the init constructor is called on creation
        init: function (p) {
            // You can call the parent's constructor with this._super(..)
            this._super(p, {
                sheet: "player" // Setting a sprite sheet sets sprite width and height
            });

            // Add in pre-made components to get up and running quickly
            // The `2d` component adds in default 2d collision detection
            // and kinetics (velocity, gravity)
            // The `platformerControls` makes the player controllable by the
            // default input actions (left, right to move,  up or action to jump)
            // It also checks to make sure the player is on a horizontal surface before
            // letting them jump.
            this.add('2d, platformerControls, animation');
        },

        //TODO: Add event driven stuff (Collisions, down to go through door, etc)
        step: function (dt) {
            this.p.socket.emit('update', {
                playerId: this.p.playerId,
                x: this.p.x,
                y: this.p.y,
                sheet: this.p.sheet
            });
        }
    });

    Q.Sprite.extend('Actor', {
        init: function (p) {
            this._super(p, {
                update: true
            });

            var temp = this;

            setInterval(function () {
                if (!temp.p.update) {
                    temp.destroy();
                }

                temp.p.update = false;
            }, 3000);
        }
    });
});
Q.Sprite.extend("powerup", {
    init: function(p) {
        this._super(p, {
            type: Q.SPRITE_POWERUP,
            collisionMask: Q.SPRITE_PLAYER,
            sensor: true
        });

        this.on("sensor");
    },

    sensor: function(colObj) {
        // TODO: Add the component which represents this power up?
    }
});

// TODO:
// Needs to not collide
// Needs to change colour when a player hits it
// Needs to change colour when a player is within vicinity
//  (i.e. make sprite 'bigger')
// Needs to update score for whoever holds it

Q.Sprite.extend("Flag", {
    init: function (p) {
        this._super(p, {
            sheet: "flag",
            type: Q.SPRITE_FLAG,
            // collisionMask specifies what things will collide
            // with the sprite when the other things move into this sprite
            collisionMask: Q.SPRITE_NONE
        })
    }
});

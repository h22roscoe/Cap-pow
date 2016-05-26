// TODO:
// Needs to not collide
// Needs to change colour when a player hits it
// Needs to change colour when a player is within vicinity
//  (i.e. make sprite 'bigger')
// Needs to update score for whoever holds it

function withinRange(flagX, flagY, playerX, playerY) {
    // assumes flagX and flagY are centred and size of
    // a flag is 90 frames wide and 30 tall (as in tmpsprites.json)
    return (playerX >= flagX - 45 && playerX < flagX + 45
         && playerY >= flagY - 15 && playerY < flagY + 15)
}

function contains(a, obj) {
    var i = a.length;

    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }

    return false;
}

Q.Sprite.extend("Flag", {
    init: function (p) {
        this._super(p, {
            sheet: "flag",
            type: Q.SPRITE_FLAG,
            withinRange: false,
            // collisionMask specifies what things will collide
            // with the sprite when the other things move into this sprite
            collisionMask: Q.SPRITE_NONE
        });
    },

    step: function (dt) {

    }
});

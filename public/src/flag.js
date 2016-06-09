Quintus.Flag = function (Q) {
    Q.Sprite.extend("Flag", {
        init: function(p) {
            this._super(p, {
                sheet: "flag",
                type: Q.SPRITE_FLAG,
                shouldUpdatePoints: false,
                collisionMask: Q.SPRITE_NONE,
                player: undefined
            });
        },

        step: function(dt) {
            this.p.shouldUpdatePoints = this.withinRange(this.p.player)
                && !this.othersWithinRange();
        },

        withinRange: function(player) {
            // Assumes flagX and flagY are centred and size of
            // a flag is 90 frames wide and 30 tall (as in tmpsprites.json)
            return (player.p.x >= this.p.x - 45 && player.p.x < this.p.x + 45
                && player.p.y >= this.p.y - 15 && player.p.y < this.p.y + 15);
        },

        othersWithinRange: function() {
            var actors = Q("Actor").items;
            for (var i = 0; i < actors.length; i++) {
                if (actors[i].playerId != this.p.player.p.playerId
                        && this.withinRange(actors[i])) {
                    return true;
                }
            }

            return false;
        },

        contains: function(a, obj) {
            var i = a.length;

            while (i--) {
                if (a[i] === obj) {
                    return true;
                }
            }

            return false;
        }
    });
}

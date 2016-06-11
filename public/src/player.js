Quintus.Player = function (Q) {
    Q.Sprite.extend("Player", {
        init: function (p) {
            this._super(p, {
                //sheet: "player",
                // Setting a sprite sheet sets sprite width and height
                type: Q.SPRITE_PLAYER,
                // TODO: Need to change collisionMask so that players
                // dont collide with each other
                collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_DOOR | Q.SPRITE_COLLECTABLE | Q.SPRITE_POWERUP | Q.KILL_LAYER,
                jumpSpeed: -300,
                speed: 100,
                gamePoints: 0
            });

            this.add("2d, platformerControls, animation");

            Q.input.on("down", this, "checkDoor");
        },

        checkDoor: function() {
            this.p.checkDoor = true;
        },

        step: function (dt) {
            this.p.socket.emit("update", {
                playerId: this.p.playerId,
                x: this.p.x,
                y: this.p.y,
                sheet: this.p.sheet
            });

            if (this.p.door) {
                if (this.p.checkDoor) {
                    // Enter door.
                    this.p.y = this.p.door.p.y;
                    this.p.x = this.p.door.p.x;
                    this.p.toDoor = this.p.door.findLinkedDoor();
                }  else if (this.p.toDoor) {
                    // Transport to matching door.
                    this.p.y = this.p.toDoor.p.y;
                    this.p.x = this.p.toDoor.p.x;
                    this.stage.centerOn(this.p.x, this.p.y);
                    this.p.toDoor = false;
                    this.stage.follow(this);
                }
            }

            this.p.door = false;
            this.p.checkDoor = false;
        }
    });

    Q.Sprite.extend("Actor", {
        init: function (p) {
            this._super(p, {
                update: true,
                type: Q.SPRITE_ACTOR,
                collisionMask: Q.SPRITE_DEFAULT
            });

            var temp = this;

            // This interval method will destroy an actor when it disconnects
            // after 30 seconds
            setInterval(function () {
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

Quintus.Player = function (Q) {
    Q.Sprite.extend("Player", {
        init: function (p) {
            this._super(p, {
                //sheet: "player",
                // Setting a sprite sheet sets sprite width and height
                type: Q.SPRITE_PLAYER,
                // TODO: Need to change collisionMask so that players
                // dont collide with each other
                collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_DOOR | Q.SPRITE_COLLECTABLE | Q.SPRITE_POWERUP,
                jumpSpeed: -300,
                speed: 100,
                gamePoints: 0
            });

            this.add("2d, platformerControls, animation");

            this.on("bump.left,bump.right,bump.top", this, "cannotAttack");

            Q.input.on("down", this, "checkDoor");
            Q.input.on("fire", this, "attack");

            player = this;
            player.justAttacked = false;
            player.justBumped = false;

            this.attackedInterval = setInterval(function () {
                player.justAttacked = false;
                console.log("playerJustAttack is", player.justAttacked);
            }, 3000);

            this.bumpedInterval = setInterval(function () {
                player.justBumped = false;
                console.log("playerJustBump is", player.justBumped);
                player.timeOut = setTimeout(function () {
                    Q.input.on("fire", player, "attack");
                    console.log("fireOn");
                }, 500);
            }, 1000);
        },

        cannotAttack: function(collision) {
            var player = this;
            Q.input.off("fire");
            player.justBumped = true;
        },

        attack: function() {
            if (!this.justAttacked && !this.justBumped) {
                console.log("attacking");
                var direction;
                if (Q.inputs["left"]) {
                    this.p.vx -= 1500;
                    direction = "left";
                } else if (Q.inputs["right"]) {
                    this.p.vx += 1500;
                    direction = "right";
                } else if (Q.inputs["up"]) {
                    this.p.vy -= 300;
                    direction = "up";
                };

                this.justAttacked = true;
                this.p.socket.emit("justAttacked", {
                    attackingPlayer: player.p.playerId,
                    direction: direction
                });
            }
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

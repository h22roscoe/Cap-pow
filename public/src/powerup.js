Quintus.Powerup = function (Q) {
    var slowId = 0;
    var fastId = 0;
    var heavyId = 0;
    var lightId = 0;
    var freezeId = 0;
    var flagMoveId = 0;

    Q.Sprite.extend("Powerup", {
        init: function (p) {
            this._super(p, {
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_NONE,
                sensor: true,
                gravity: 0,
            });

            this.on("sensor");
        },
    });


    Q.Powerup.extend("Slow", {
        init: function (p) {
            this._super(Q._defaults(p, {
                sheet: "red",
                powerupId: ++slowId
            }));
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Slow",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Slow", {
        added: function () {
            this.entity.p.speed /= 2;
            this.timeLeft = 10 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft === 0) {
                this.entity.p.speed *= 2;
                this.entity.del("Slow");
            } else {
                this.timeLeft--;
            }
        }
    });

    Q.Powerup.extend("Fast", {
        init: function (p) {
            this._super(Q._defaults(p, {
                sheet: "green",
                powerupId: ++fastId
            }));
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Fast",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Fast", {
        added: function () {
            this.entity.p.speed *= 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft === 0) {
                this.entity.p.speed /= 2;
                this.entity.del("Fast");
            } else {
                this.timeLeft--;
            }
        }
    });


    Q.Powerup.extend("Heavy", {
        init: function (p) {
            this._super(Q._defaults(p, {
                sheet: "darkBlue",
                powerupId: ++heavyId
            }));
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Heavy",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Heavy", {
        added: function () {
            this.entity.p.gravity *= 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft === 0) {
                this.entity.p.gravity /= 2;
                this.entity.del("Heavy");
            } else {
                this.timeLeft--;
            }
        }
    });


    Q.Powerup.extend("Light", {
        init: function (p) {
            this._super(Q._defaults(p, {
                sheet: "yellow",
                powerupId: ++lightId
            }));
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Light",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Light", {
        added: function () {
            this.entity.p.gravity /= 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            if (this.timeLeft === 0) {
                this.entity.p.gravity *= 2;
                this.entity.del("Light");
            } else {
                this.timeLeft--;
            }
        }
    });

    Q.Powerup.extend("Freeze", {
        init: function (p) {
            this._super(Q._defaults(p, {
                sheet: "lightBlue",
                powerupId: ++freezeId
            }));
        },

        sensor: function (colObj) {
            colObj.p.socket.emit("powerUp", {
                name: "Freeze",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y
            });

            this.destroy();
        }
    });

    Q.component("Freeze", {
        added: function () {
            this.entity.p.vx = 0;
            this.entity.p.vy = 0;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function (dt) {
            // If the player tries to move, set it's velocity to 0
            this.entity.p.vx = 0;
            this.entity.p.vy = 0;

            if (this.timeLeft === 0) {
                this.entity.del("Freeze");
            } else {
                this.timeLeft--;
            }
        }
    });

    Q.Powerup.extend("FlagMove", {
        init: function (p) {
            this._super(Q._defaults(p, {
                sheet: "purple",
                powerupId: ++flagMoveId
            }));
        },

        flagPositions: [
            {
                x: 693,
                y: 557
            },
            {
                x: 300,
                y: 50
            },
            {
                x: 1400,
                y: 160
            },
            {
                x: 1300,
                y: 190
            },
            {
                x: 200,
                y: 200
            },
            {
                x: 400,
                y: 400
            },
            {
                x: 800,
                y: 800
            },
            {
                x: 1200,
                y: 900
            },
            {
                x: 1300,
                y: 190
            }
        ],

        sensor: function (colObj) {
            var randomIndex = Math.floor(Math.random() * this.flagPositions.length);
            var flagPos = this.flagPositions[randomIndex];
            var flag = Q("Flag").first();

            flag.p.x = flagPos.x;
            flag.p.y = flagPos.y;


            colObj.p.socket.emit("powerUp", {
                name: "FlagMove",
                playerId: colObj.p.playerId,
                powerupId: this.p.powerupId,
                x: this.p.x,
                y: this.p.y,
                flagPos: flagPos
            });

            this.destroy();
        }
    });

}

Quintus.Powerup = function(Q) {
    var slowId = 0;
    var fastId = 0;
    var heavyId = 0;
    var lightId = 0;
    var freezeId = 0;


    Q.Sprite.extend("Powerup", {
        init: function (p) {
            this._super(p, {
                type: Q.SPRITE_POWERUP,
                collisionMask: Q.SPRITE_PLAYER,
                sensor: true,
                gravity: 0,
            });

            this.on("sensor");
            this.add("2d");
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
        added: function() {
            this.entity.p.speed /= 2;
            this.timeLeft = 10 * 60;
            this.entity.on("step", this, "step");
        },

        step: function(dt) {
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

        sensor: function(colObj) {
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
        added: function() {
            this.entity.p.speed *= 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function(dt) {
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

        sensor: function(colObj) {
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
        added: function() {
            this.entity.p.gravity *= 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function(dt) {
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

        sensor: function(colObj) {
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
        added: function() {
            this.entity.p.gravity /= 2;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function(dt) {
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

        sensor: function(colObj) {
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
        added: function() {
            this.entity.p.vx = 0;
            this.entity.p.vy = 0;
            this.timeLeft = 5 * 60;
            this.entity.on("step", this, "step");
        },

        step: function(dt) {
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

    /*  Q.Powerup.extend("FlagMove", {
          init: function (p) {
              this._super(p, {
                  sheet: "White",
                  gravity: 0
              });
          },

          sensor: function (colObj) {
              colObj.p.socket.broadcast.to(colObj.p.roomName).emit("flag", {
                  playerId: colObj.p.playerId,

              });
              this.destroy();
          }
      });  */

}

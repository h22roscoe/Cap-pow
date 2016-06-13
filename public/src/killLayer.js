Quintus.KillLayer = function(Q) {
    Q.TileLayer.extend("KillLayer", {
        init: function(p) {
            this._super(p);

            this.p.kill = true;

            this.on("sensor");
        },

        sensor: function(colObj) {
            var killLayer = this;
            if (killLayer.p.kill) {
                if (colObj.isA("Player")) {
                    killLayer.p.kill = false;

                    // Remove the player from stage
                    setUpObject.stage.unfollow();
                    colObj.hide();

                    // Wait 5 seconds before adding again
                    var t = setTimeout(function() {
                        socket.emit("respawn", {});

                        killLayer.p.kill = true;
                    }, 3000);
                }
            }
        }
    });
}

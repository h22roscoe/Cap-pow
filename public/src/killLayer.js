Quintus.CappowLayers = function(Q) {
    Q.TileLayer.extend("KillLayer", {
        init: function(p) {
            this._super(p);

            this.p.kill = true;

            this.on("sensor");
            
            var kill = this;
            socket.on("newSpawn", function (data) {
                kill.p.newSpawnPosition = data.pos;
            });
        },

        sensor: function(colObj) {
            var killLayer = this;
            if (killLayer.p.kill) {
                if (colObj.isA("Player")) {
                    killLayer.p.kill = false;

                    // Remove the player from stage
                    setUpObject.stage.unfollow();
                    colObj.hide();
                    colObj.p.died = true;
                    socket.emit("died", {});

                    // Wait 5 seconds before adding again
                    var t = setTimeout(function() {
                        colObj.p.x = killLayer.p.newSpawnPosition.x;
                        colObj.p.y = killLayer.p.newSpawnPosition.y;

                        setUpObject.stage.follow(colObj);
                        colObj.show();
                        killLayer.p.kill = true;
                    }, 3000);
                }
            }
        }
    });

}

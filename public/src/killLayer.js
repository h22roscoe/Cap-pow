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
                    console.log("Before: ", colObj.p);

                    // Remove the player from stage
                    setUpObject.stage.remove(colObj);

                    // Wait 5 seconds before adding again
                    var t = setTimeout(function() {
                        var randIdx = Math.floor(Math.random() * 4);
                        var randPos = startPos[randIdx];
                        colObj.p.x = randPos.x;
                        colObj.p.y = randPos.y;

                        setUpObject.stage.insert(colObj);
                        killLayer.p.kill = true;
                        console.log("After: ", colObj.p);
                    }, 3000);
                }
            }
        }
    });
}

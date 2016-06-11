Quintus.KillLayer = function(Q) {
    Q.TileLayer.extend("KillLayer", {
        init: function(p) {
            this._super(p);

            this.on("sensor");
        },

        sensor: function(colObj) {
            if (colObj.isA("Player")) {
                console.log("Before: ", colObj.p);

                // Remove the player from stage
                setUpObject.stage.remove(colObj);

                // Wait 5 seconds before adding again
                var t = setTimeout(function () {
                    var randIdx = Math.floor(Math.random() * 4);
                    var randPos = startPos[randIdx];
                    colObj.p.x = randPos.x;
                    colObj.p.y = randPos.y;

                    setUpObject.stage.insert(colObj);
                    console.log("After: ", colObj.p);
                }, 5000);
            }
        }
    });
}

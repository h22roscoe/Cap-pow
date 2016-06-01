var Game = {
    init: function () {
        Game.Q = window.Q = Quintus({
                audioSupported: ["mp3", "ogg"],
                development: true
            })
            .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
            .setup({
                maximize: true
            })
            .controls().touch()
            .enableSound();

        Game.Q.SPRITE_PLAYER = 64;
        Game.Q.SPRITE_FLAG = 128;
        Game.Q.SPRITE_POWERUP = 256;
        Game.actors = [];
        Game.setUpObject = {
            stage: null
        };

        Game.setUpObject.updateCount = function (data) {
            UiPlayers.innerHTML = "Players: " + data.playerCount;
        };

        Game.setUpObject.addNewPlayer = function (data) {
            // Set this players unique id
            Game.setUpObject.selfId = data.playerId;

            // Create the actual player with this unique id
            Game.setUpObject.player = new Q.Player({
                playerId: Game.setUpObject.selfId,
                x: 500,
                y: 400,
                socket: socket
            });

            if (Game.setUpObject.stage) {
                // Insert this player into the stage
                Game.setUpObject.stage.insert(Game.setUpObject.player);

                // Add a camera  for this player
                // TODO: Change to view the whole screen? Or keep like this?
                //  Is this different for mobile/web?
                Game.setUpObject.stage.add("viewport").follow(Game.setUpObject.player);
            }

            Game.setUpObject.flag.p.player = Game.setUpObject.player;

            // Updates the players points every second if within range of flag
            Game.setUpObject.timerId = setInterval(updatePoints, 1000);

            return Game.setUpObject.player;
        };

        Game.setUpObject.updateSpecificPlayerId = function (data) {
            var actor = actors.filter(function (obj) {
                return obj.playerId === data.playerId;
            })[0];

            if (actor) {
                actor.player.p.x = data.x;
                actor.player.p.y = data.y;
                actor.player.p.sheet = data.sheet;
                actor.player.p.update = true;
            } else {
                var temp = new Q.Actor({
                    playerId: data.playerId,
                    x: data.x,
                    y: data.y,
                    sheet: data.sheet
                });

                actors.push({
                    player: temp,
                    playerId: data.playerId
                });

                if (Game.setUpObject.stage) {
                    Game.setUpObject.stage.insert(temp);
                }

                actor = temp;
            }

            return actor;
        };

        // UiPlayers is element in index.html with id "players"
        Game.UiPlayers = document.getElementById("players");
        Game.UiScore = document.getElementById("score");
    },

    //Set up instance of the Quintus engine.
    //Supports .mp3 and .ogg audio files.
    //Add in all the modules we may need using include().
    //Maximise the game to the size of the browser.
    //Turns on default controls and allows touch input with mouse/touch screen.
    //Giving control() a parameter of true will use a joypad instead.
    //Enables sound.
    loadGame: function () {
        Game.init();

        console.log("Game: A user connected");

        // May not need to wait 1.5 seconds to ensure all js files are loaded,
        // because we are not using a socket.emit here anymore
        setTimeout(function () {
            Game.setUpObject.addNewPlayer({
                playerId: IO.socket.id
            });
        }, 1500);

        // Change as we will not update everyone but only those in our room
        IO.socket.on("update", function (data) {
            IO.socket.broadcast.in(IO.room).emit("updated", data);
        });

        var files = [
          "../images/tmptiles.png",
          "../data/tmplevel.json",
          "../images/tmpsprites.png",
          "../data/tmpsprites.json",
          "../images/tmpbackground.png"
        ];

        //Creating the stage for tmplevel
        Game.Q.scene("tmplevel", function (stage) {
            //Parallax (Background moves as player moves)
            //TODO: Not sure if parallax works with multiple players
            //TODO: Might need foldername/file for each of these assets
            stage.insert(new Game.Q.Repeater({
                asset: "../images/tmpbackground.png",
                speedX: 0.5,
                speedY: 0.5,
                //Only repeat the background horizontally
                repeatY: false
            }));

            // Create the walls of the game. Level is described by json. Blocks are
            // described by the sheet.
            stage.collisionLayer(new Game.Q.TileLayer({
                dataAsset: "../data/tmplevel.json",
                sheet: "tmptiles"
            }));

            Game.setUpObject.flag = new Game.Q.Flag({
                x: 180,
                y: 530
            });

            // TODO: Will need to add the flag
            stage.insert(Game.setUpObject.flag);

            // Set up the socket connections.
            Game.setUp(stage);
        });

        // Split up the blocks and sprites from being one long PNG.
        // Load the actual level and run the game.
        Game.Q.load(files.join(','), function () {
            Game.Q.sheet("tmptiles", "../images/tmptiles.png", {
                tilew: 32,
                tileh: 32
            });

            Game.Q.compileSheets("../images/tmpsprites.png", "../data/tmpsprites.json");
            Game.Q.stageScene("tmplevel");
        });
    },

    updatePoints: function () {
        if (Game.setUpObject.flag.p.shouldUpdatePoints) {
            Game.setUpObject.player.p.gamePoints++;
        }
    },

    // setUp deals with communication over the socket
    setUp: function (stage) {
        Game.setUpObject.stage = stage;

        // Update the playerCount displayed (in index.html) when
        // the playerCount changes
        socket.on("count", Game.setUpObject.updateCount);

        // Updates the player (actor) w/ playerId who just asked to be updated
        socket.on("updated", Game.setUpObject.updateSpecificPlayerId);
    }
}

IO.socket.on("loadGame", Game.loadGame);

//TODO: May need window.addEventListener("load",function() {...}); around everything

//Set up instance of the Quintus engine.
//Supports .mp3 and .ogg audio files.
//Add in all the modules we may need using include().
//Maximise the game to the size of the browser.
//Turns on default controls and allows touch input with mouse/touch screen.
//Giving control() a parameter of true will use a joypad instead.
//Enables sound.
var Q = window.Q = Quintus({
        audioSupported: ['mp3', 'ogg'],
        development: true
    })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .setup({
        maximize: true
    })
    .controls().touch()
    .enableSound();

var players = [];
var socket = io(); //.connect('http://146.169.45.144:8080');
var UiPlayers = document.getElementById("players");

var ObjectFiles = ['./src/player'];

require(ObjectFiles, function () {
    function setUp(stage) {
        socket.on('count', function (data) {
            UiPlayers.innerHTML = 'Players: ' + data['playerCount'];
        });

        socket.on('connected', function (data) {
            selfId = data['playerId'];

            player = new Q.Player({
                playerId: selfId,
                x: 200,
                y: 0,
                socket: socket
            });

            stage.insert(player);
            stage.add('viewport').follow(player);
        });

        socket.on('updated', function (data) {
            var actor = players.filter(function (obj) {
                return obj.playerId == data['playerId'];
            })[0];
            if (actor) {
                actor.player.p.x = data['x'];
                actor.player.p.y = data['y'];
                actor.player.p.sheet = data['sheet'];
                actor.player.p.update = true;
            } else {
                var temp = new Q.Actor({
                    playerId: data['playerId'],
                    x: data['x'],
                    y: data['y'],
                    sheet: data['sheet']
                });

                players.push({
                    player: temp,
                    playerId: data['playerId']
                });

                stage.insert(temp);
            }
        });
    }

    //Creating the stage for tmplevel
    Q.scene("tmplevel", function (stage) {
        //Parallax (Background moves as player moves)
        //TODO: Not sure if parallax works with multiple players
        //TODO: Might need foldername/file for each of these assets
        //        stage.insert(new Q.Repeater({
        //            asset: "tmpbackground.png",
        //            speedX: 0.5,
        //            speedY: 0.5
        //        }));

        //Create the walls of the game. Level is described by json. Blocks are
        //described by the sheet.
        stage.collisionLayer(new Q.TileLayer({
            dataAsset: '/data/tmplevel.json',
            sheet: 'tmptiles'
        }));

        //Create the player and add them to the stage at (0,0)
        //var player = stage.insert(new Q.Player());

        //Camera will follow the player.
        //TOOD: Change to view the whole level
        //stage.add("viewport").follow(player);

        //TODO: Will need to add the flag

        //Set up the socket connections.
        setUp(stage);
    });


    //TODO: May not need background in files here
    var files = [
        '/images/tmptiles.png',
        '/data/tmplevel.json',
        '/images/tmpsprites.png',
        '/data/tmpsprites.json',
        '/images/tmpbackground.png'
    ];

    //Split up the blocks and sprites from being one long PNG.
    //Load the actual level and run the game.
    Q.load(files.join(','), function () {
        Q.sheet('tmptiles', '/images/tmptiles.png', {
            tilew: 32,
            tileh: 32
        });
        Q.compileSheets('/images/tmpsprites.png', '/data/tmpsprites.json');
        Q.stageScene('tmplevel', 0);
    });
});

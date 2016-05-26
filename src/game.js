// TODO: May need
//  window.addEventListener("load",function() {...}); around everything

//Set up instance of the Quintus engine.
//Supports .mp3 and .ogg audio files.
//Add in all the modules we may need using include().
//Maximise the game to the size of the browser.
//Turns on default controls and allows touch input with mouse/touch screen.
//Giving control() a parameter of true will use a joypad instead.
//Enables sound.

var Q = window.Q = Quintus({
        audioSupported: ["mp3", "ogg"],
        development: true
    })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .setup({
        maximize: true
    })
    .controls().touch()
    .enableSound();

Q.SPRITE_PLAYER = 1;
Q.SPRITE_FLAG = 2;
Q.SPRITE_POWERUP = 4;

// players will hold all Player objects currently in game
var players = [];
// Create socket object that connects to our server (CloudStack VM IP address)
var socket = io.connect("https://cap-pow.herokuapp.com");
//var socket = io.connect("http://localhost:3000");
//var socket = io.connect("http://146.169.45.144");

// UiPlayers is element in index.html with id "players"
var UiPlayers = document.getElementById("players");

var setUpObject = {
    stage: null
};

setUpObject.updateCount = function (data) {
    UiPlayers.innerHTML = "Players: " + data.playerCount;
};

setUpObject.addNewPlayer = function (data) {
    // Set this players unique id
    selfId = data.playerId;

    // Create the actual player with this unique id
    player = new Q.Player({
        playerId: selfId,
        x: 200,
        y: 0,
        socket: socket
    });

    // Insert this player into the stage
    setUpObject.stage.insert(player);

    // Add a camera for this player
    // TODO: Change to view the whole screen? Or keep like this?
    //  Is this different for mobile/web?
    setUpObject.stage.add("viewport").follow(player);
};

setUpObject.updateSpecificPlayerId = function (data) {
    var actor = players.filter(function (obj) {
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

        players.push({
            player: temp,
            playerId: data.playerId
        });

        setUpObject.stage.insert(temp);
    }
};

// setUp deals with communication over the socket
function setUp(stage) {
    setUpObject.stage = stage;

    // Update the playerCount displayed (in index.html) when
    // the playerCount changes
    socket.on("count", setUpObject.updateCount);

    // Just after a user connects...
    socket.on("connected", setUpObject.addNewPlayer);

    // Updates the player (actor) w/ playerId who just asked to be updated
    socket.on("updated", setUpObject.updateSpecificPlayerId);
};

//Creating the stage for tmplevel
Q.scene("tmplevel", function (stage) {
    //Parallax (Background moves as player moves)
    //TODO: Not sure if parallax works with multiple players
    //TODO: Might need foldername/file for each of these assets
    stage.insert(new Q.Repeater({
        asset: "../images/tmpbackground.png",
        speedX: 0.5,
        speedY: 0.5
    }));

    // Create the walls of the game. Level is described by json. Blocks are
    // described by the sheet.
    stage.collisionLayer(new Q.TileLayer({
        dataAsset: "../data/tmplevel.json",
        sheet: "tmptiles"
    }));

    // TODO: Will need to add the flag
    stage.insert(new Q.Flag({
        x: 180,
        y: 80
    }));

    // Set up the socket connections.
    setUp(stage);
});


// TODO: May not need background in files here
var files = [
        "../images/tmptiles.png",
        "../data/tmplevel.json",
        "../images/tmpsprites.png",
        "../data/tmpsprites.json",
        "../images/tmpbackground.png"
    ];

// Split up the blocks and sprites from being one long PNG.
// Load the actual level and run the game.
Q.load(files.join(','), function () {
    Q.sheet("tmptiles", "../images/tmptiles.png", {
        tilew: 32,
        tileh: 32
    });
    Q.compileSheets("../images/tmpsprites.png", "../data/tmpsprites.json");
    Q.stageScene("tmplevel");
});

//TODO: May need window.addEventListener("load",function() {...}); around everything

//Set up instance of the Quintus engine.
//Supports .mp3 and .ogg audio files.
//Add in all the modules we may need using include().
//Maximise the game to the size of the browser.
//Turns on default controls and allows touch input with mouse/touch screen.
//Giving control() a parameter of true will use a joypad instead.
//Enables sound.
var Q = window.Q = Quintus({
        audoSupported: ['mp3', 'ogg']
    })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .setup({
        maximize: true
    })
    .controls().touch()
    .enableSound();

//Creating the stage for tmplevel
Q.scene("tmplevel", function (stage) {
    //Parallax (Background moves as player moves)
    //TODO: Not sure if parallax works with multiple players
    //TODO: Might need foldername/file for each of these assets
    stage.insert(new Q.Repeater({
        asset: "tmp-background.png",
        speedX: 0.5,
        speedY: 0.5
    }));
    //Create the walls of the game. Level is described by json. Blocks are
    //described by the sheet.
    stage.collisionLayer(new Q.TileLayer({
        dataAsset: 'tmplevel.json',
        sheet: 'tmptiles'
    }));
    //Create the player and add them to the stage at (0,0)
    var player = stage.insert(new Q.Player());

    //Camera will follow the player.
    //TOOD: Change to view the whole level
    stage.add("viewport").follow(player);

    //TODO: Will need to add the flag
});

//TODO: May not need background in files here
var files = [
    'tmptiles.png',
    'tmplevel.json',
    'sprites.png',
    'sprites.json',
    'tmp-background.png'
  ];

//Split up the blocks and sprites from being one long PNG.
//Load the actual level and run the game.
Q.load(files.join(','), function () {
    Q.sheet('tiles', 'tmptiles.png', {
        tilew: 32,
        tileh: 32
    });
    Q.compileSheets('tmpsprites.png', 'tmpsprites.json');
    Q.stageScene('tmplevel', 0);
});

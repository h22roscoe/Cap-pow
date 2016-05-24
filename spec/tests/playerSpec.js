var Q = new Quintus({
        audioSupported: ['mp3', 'ogg'],
        development: true
    })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .setup({
        maximize: true
    })
    .controls().touch()
    .enableSound();

define("Player", function () {
    var player;

    beforeEach(function () {
        player = Q.Player();
    });

    it("Does nothing", function () {

    });
});

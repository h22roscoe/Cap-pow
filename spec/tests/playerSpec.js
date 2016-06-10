describe("Player", function () {
    var player;

    beforeEach(function () {
        player = new Q.Player();
    });

    it("has a sheet of flag when created", function () {
        expect(player.p.sheet).toEqual("player1");
    });

    it("has a type of SPRITE_PLAYER when created", function () {
        expect(player.p.type).toEqual(Q.SPRITE_PLAYER);
    });

    it("initialises players points to 0", function () {
        expect(player.p.gamePoints).toEqual(0);
    });
});

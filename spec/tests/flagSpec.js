describe("Flag", function () {
    var flag, player;

    beforeEach(function () {
        flag = new Q.Flag({
            x: 0,
            y: 0
        });

        player = new Q.Player({
            x: 10,
            y: 0
        });

        players.push({
            player: player,
            playerId: null
        });
    });

    it("has a sheet of flag when created", function () {
        expect(flag.p.sheet).toEqual("flag");
    });

    it("has a type of SPRITE_FLAG when created", function () {
       expect(flag.p.type).toEqual(Q.SPRITE_FLAG);
    });

    it("has nothing which will collide with it", function () {
        expect(flag.p.collisionMask).toEqual(Q.SPRITE_NONE);
    });

    it("knows if a player is nearby", function () {
        setTimeout(flag.step(flag, 10), 10);

        expect(flag.p.nearbyPlayers).toBeDefined();
        expect(flag.p.nearbyPlayers).toContain(player);
    });
});

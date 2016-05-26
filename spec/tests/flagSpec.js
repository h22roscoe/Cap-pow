describe("Flag", function () {
    var flag, player;

    beforeEach(function () {
        flag = new Q.Flag({
            x: 0,
            y: 0
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

    describe("how flag responds to Player with selfId", function () {
        beforeEach(function () {
            setUpObject.player = new Q.Player({
                playerId: setUpObject.selfId,
                x: 10,
                y: 0
            });
        });

        it("knows that selfId is near flag", function () {
            setTimeout(flag.step(flag, 10), 10);

            expect(flag.p.withinRange).toBe(true);
        });
    });
});

describe("Game setup", function () {
    var flag, player;

    beforeEach(function () {
        player = setUpObject.addNewPlayer({ playerId: "test" });

        flag = new Q.Flag({
            x: 200,
            y: 0,
            player: player
        });

        setUpObject.flag = flag;
    });

    afterEach(function () {
        player.destroy();
        flag.destroy();
        clearInterval(timerId);
    });

    it("has instantiated the global Q (Quintus Engine)", function () {
        expect(Q).not.toBeNull();
    });

    it("sets the global bit points for various sprites", function () {
        expect(Q.SPRITE_PLAYER).toEqual(1);
        expect(Q.SPRITE_FLAG).toEqual(2);
        expect(Q.SPRITE_POWERUP).toEqual(4);
    });

    it("has created the tmplevel scene on the Q variable", function () {
        expect(Q.scenes.tmplevel).toBeDefined();
    });

    it("updates the value of the players points each second", function () {
        expect(player.p.gamePoints).toEqual(0);
        player.p.x = flag.p.x;
        player.p.y = flag.p.y;

        flag.step(flag, null);
        updatePoints();

        console.log("Player: ", player);
        console.log("Flag: ", flag);

        expect(player.p.gamePoints).toEqual(1);
    });
});

describe("Game setup", function () {
    it("has instantiated the global Q (Quintus Engine)", function () {
        expect(Q).not.toBeNull();
    });

    it("sets the global bit points for various sprites", function () {
        expect(Q.SPRITE_PLAYER).toEqual(64);
        expect(Q.SPRITE_FLAG).toEqual(128);
        expect(Q.SPRITE_POWERUP).toEqual(256);
    });

    it("has created the castleLevel scene on the Q variable", function () {
        expect(Q.scenes.castleLevel).toBeDefined();
    });
});

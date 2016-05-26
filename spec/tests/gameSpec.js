describe("Game setup", function () {
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

    it("has created a stage", function () {
        setTimeout(function () {
            // Do nothing but wait ten milliseconds for loading
            //  before running test
        }, 10);
        expect(Q.stages).toContain(jasmine.any(Object));
    })
});

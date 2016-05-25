describe("Flag", function () {
    var flag;

    beforeEach(function () {
        flag = new Q.Flag();
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
});

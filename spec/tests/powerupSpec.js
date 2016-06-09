describe("Powerup", function () {
    var player;

    beforeEach(function () {
        player = new Q.Player();
    });
    
    afterEach(function () {
        player.destroy();
    })
    
    it("will slow down a player", function () {
        origSpeed = player.p.speed;
        player.add("slow");
        expect(player.p.speed).toBeLessThan(origSpeed);
    });
    
    it("will speed up a player", function () {
        origSpeed = player.p.speed;
        player.add("fast");
        expect(player.p.speed).toBeGreaterThan(origSpeed);
    });
    
    it("will make a player heavier", function () {
        origGravity = player.p.gravity;
        player.add("heavy");
        expect(player.p.gravity).toBeGreaterThan(origGravity);
    });
    
    it("will make a player lighter", function () {
        origGravity = player.p.gravity;
        player.add("light");
        expect(player.p.gravity).toBeLessThan(origGravity);
    });
    
    it("will freeze a player", function () {
        player.p.vx = 3;
        player.p.vy = 4;
        player.add("freeze");
        expect(player.p.vx).toEqual(0);
        expect(player.p.vy).toEqual(0);
    });
});
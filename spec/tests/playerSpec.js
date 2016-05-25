describe('Player Tests', function () {
    var player;
    beforeEach(function () {
        player = Q.Player();
    });

    it("has instantiated the Quintus Engine (Q)", function () {
        expect(Q).isNot.toBeNull;
    })
})

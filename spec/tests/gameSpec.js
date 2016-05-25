describe("Game setup", function () {
//    beforeEach(function () {
//        console.log("socket: ", socket);
//
//        socket.emit("count", { playerCount: 2 });
//    });

    it("has instantiated the global Q (Quintus Engine)", function () {
        expect(Q).not.toBeNull();
    });

    it("sets the global bit points for various sprites", function () {
        expect(Q.SPRITE_PLAYER).toEqual(1);
        expect(Q.SPRITE_FLAG).toEqual(2);
        expect(Q.SPRITE_POWERUP).toEqual(4);
    });

    it("has created a scene on the Q variable", function () {
        expect(Q.scene).toBeDefined();
    });

//    it("recieves a playerCount of 2 after a count " +
//       "emmision w/ playerCount = 2", function () {
//        expect(UiPlayers.innerHTML).toEqual("Players: 2");
//    });
});

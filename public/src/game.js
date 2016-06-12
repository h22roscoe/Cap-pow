var Q = window.Q = Quintus({
        audioSupported: ["mp3", "ogg"],
        development: true
    })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .include("Player, Flag, Powerup, Door, KillLayer")
    .setup({
        width: $(window).width() - 10,
        height: $(window).height() - 10,
        scaleToFit: true
    })
    .controls(true).touch()
    .enableSound();

Q.setImageSmoothing(false);

Q.SPRITE_PLAYER = 64;
Q.SPRITE_FLAG = 128;
Q.SPRITE_POWERUP = 256;
Q.SPRITE_ACTOR = 512;
Q.SPRITE_DOOR = 1024;
Q.KILL_LAYER = 2048;

var actors = [];
setUpObject = {
    stage: null
};

var startPos = {
    0: {
        x: 231,
        y: 84
    },

    1: {
        x: 104,
        y: 693
    },

    2: {
        x: 1365,
        y: 525
    },

    3: {
        x: 1323,
        y: 41
    }
}

var files = [
    "../data/castleLevel.tmx",
    "../data/mountainLevel.tmx",
    "../images/tmptiles.png",
    "../data/tmplevel.json",
    "../images/tmpsprites.png",
    "../data/tmpsprites.json",
    "../images/tmpbackground.png",
    "../data/sprites.json",
    "../images/sprites.png",
    "../images/powerups.png",
    "../data/powerups.json",
    "../audio/MLGHornsSoundEffect.mp3"
];

var roomName = sessionStorage.getItem("roomName");
var socket = io.connect("/game");
var winPoints;
var noWinner = true;

Q.loadTMX(files.join(','), function () {
    Q.compileSheets("../images/sprites.png", "../data/sprites.json");
    Q.compileSheets("../images/tmpsprites.png", "../data/tmpsprites.json");
    Q.compileSheets("../images/powerups.png", "../data/powerups.json");
    Q.stageScene("castleLevel");
    // Q.stageScene("mountainLevel");

    socket.emit("joinGame", {
        roomName: roomName,
        playerId: sessionStorage.getItem("playerId")
    });
}, {
    progressCallback: function (loaded, total) {
        var element = document.getElementById("loading_progress");
        element.style.width = Math.floor(loaded / total * 100) + "%";

        if (loaded === total) {
            document.getElementById("loading").remove();
        }
    }
});

Q.scene("endGame", function(stage) {
    var box = stage.insert(new Q.UI.Container({
        x: Q.width / 2,
        y: Q.height / 2,
        fill: "rgba(255,255,255,0.5)"
    }));

    var button = box.insert(new Q.UI.Button({
        x: 0,
        y: 0,
        fill: "#888888",
        label: "Back to room"
    }));

    var label = box.insert(new Q.UI.Text({
        x: 10,
        y: -10 - button.p.h,
        label: stage.options.label
    }));

    Q.audio.play("../audio/MLGHornsSoundEffect.mp3");

    button.on("click", function() {
        Q.clearStages();

        window.location.href = "/room/" + roomName;
    });

    box.fit(20);
});

Q.scene("mountainLevel", function(stage) {
    Q.stageTMX("../data/mountainLevel.tmx", stage);

    // Set up the socket connections.
    setUp(stage);
});


Q.scene("castleLevel", function(stage) {
    Q.stageTMX("../data/castleLevel.tmx", stage);

    // Set up the socket connections.
    setUp(stage);
});

function createTableRowWithId(playerId, contents) {
    return "<tr id='" + playerId + "'>" + contents + "</tr>";
}

function createTableDataRow(playerId, gamePoints) {
    return "<td>" + playerId + "</td><td>" + gamePoints + "</td>";
}

setUpObject.addSelf = function(data) {
    // Set this players unique id
    setUpObject.selfId = sessionStorage.getItem("playerId");

    // Create the actual player with this unique id
    setUpObject.player = new Q.Player({
        sheet: "player" + data.id,
        socket: socket,
        roomName: roomName,
        playerId: setUpObject.selfId,
        x: startPos[data.id].x,
        y: startPos[data.id].y
    });

    $("#scores > tbody:last-child").append(
        createTableRowWithId(setUpObject.selfId,
            createTableDataRow(setUpObject.selfId, 0)));

    // Insert this player into the stage
    setUpObject.stage.insert(setUpObject.player);

    // Add a camera  for this player
    setUpObject.stage.add("viewport").follow(setUpObject.player);

    setUpObject.flag = new Q.Flag({
        x: 698,
        y: 552,
        player: setUpObject.player
    });

    setUpObject.stage.insert(setUpObject.flag);

    // Updates the players points every second if within range of flag
    setUpObject.timerId = setInterval(updatePoints, 1000);

    return setUpObject.player;
};

setUpObject.updateSpecificPlayerId = function (data) {
    var actor = actors.filter(function (obj) {
        return obj.player.p.playerId === data.playerId;
    })[0];

    if (actor) {
        actor.player.p.x = data.x;
        actor.player.p.y = data.y;
        actor.player.p.hidden = data.hidden;
        actor.player.p.sheet = data.sheet;
        actor.player.p.update = true;
    } else {
        var temp = new Q.Actor({
            playerId: data.playerId,
            x: data.x,
            y: data.y,
            sheet: data.sheet
        });

        actors.push({
            player: temp,
            gamePoints: 0
        });

        $("#scores > tbody:last-child").append(
            createTableRowWithId(temp.p.playerId,
                createTableDataRow(temp.p.playerId, 0)));

        setUpObject.stage.insert(temp);

        actor = temp;
    }

    return actor;
};

setUpObject.updateScores = function (data) {
    var actor = actors.filter(function (obj) {
        return obj.player.p.playerId === data.playerId;
    })[0];

    actor.gamePoints = data.gamePoints;

    $("#scores #" + actor.player.p.playerId).html(
        createTableDataRow(actor.player.p.playerId, actor.gamePoints));
}

function updatePoints() {
    if (setUpObject.flag.p.shouldUpdatePoints && noWinner) {
        socket.emit("points", {
            playerId: setUpObject.player.p.playerId,
            gamePoints: ++setUpObject.player.p.gamePoints
        });

        if (setUpObject.player.p.gamePoints >= winPoints) {
            socket.emit("gameWon", {
                playerId: setUpObject.player.p.playerId
            })
        }

        $("#scores #" + setUpObject.selfId).html(
            createTableDataRow(setUpObject.selfId,
                setUpObject.player.p.gamePoints));
    }
}

// setUp deals with communication over the socket
function setUp(stage) {
    setUpObject.stage = stage;

    socket.on("gameInfo", function (data) {
        winPoints = data.winPoints;

        setUpObject.addSelf(data);
    });

    // Updates the player (actor) w/ playerId who just asked to be updated
    socket.on("updated", setUpObject.updateSpecificPlayerId);

    socket.on("newScore", setUpObject.updateScores);

    socket.on("makeFast", function (data) {
        stage.insert(new Q.Fast({
            x: data.x,
            y: data.y
        }));
    });

    socket.on("makeSlow", function (data) {
        stage.insert(new Q.Slow({
            x: data.x,
            y: data.y
        }));
    });

    socket.on("makeHeavy", function (data) {
        stage.insert(new Q.Heavy({
            x: data.x,
            y: data.y
        }));
    });

    socket.on("makeLight", function (data) {
        stage.insert(new Q.Light({
            x: data.x,
            y: data.y
        }));
    });

    socket.on("makeFreeze", function (data) {
        stage.insert(new Q.Freeze({
            x: data.x,
            y: data.y
        }));
    });

    socket.on("gameWon", function(data) {
        Q.stageScene("endGame", 1, { label: data.playerId + " Won!" });

        noWinner = false;
    });

    socket.on("makeFlagMove", function (data) {
        stage.insert(new Q.FlagMove({
            x: data.x,
            y: data.y
        }));
    });

    // When a powerup has been collected, a message specific to that
    // powerup will be emitted, causing the other players to get the
    // corresponding component for that powerup
    socket.on("powerupAcquired", function (data) {
        Q(data.name).each(function () {
            if (this.p.powerupId === data.powerupId) {
                this.destroy();
            }
        });

        if (data.name === "FlagMove") {
            setUpObject.flag.p.x = data.flagPos.x;
            setUpObject.flag.p.y = data.flagPos.y;
        } else {
            setUpObject.player.add(data.name);
        }
    });
}

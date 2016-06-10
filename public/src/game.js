var Q = window.Q = Quintus({
        audioSupported: ["mp3", "ogg"],
        development: true
    })
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
    .include("Player, Flag, Powerup, Door")
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

var actors = [];
setUpObject = {
    stage: null
};

var files = [
    "../data/castleLevel.tmx",
    "../data/level1.tmx",
    "../images/tmptiles.png",
    "../data/tmplevel.json",
    "../images/tmpsprites.png",
    "../data/tmpsprites.json",
    "../images/tmpbackground.png",
    "../data/sprites.json",
    "../images/sprites.png",
    "../images/powerups.png",
    "../data/powerups.json"
];

Q.loadTMX(files.join(','), function () {
    Q.compileSheets("../images/sprites.png", "../data/sprites.json");
    Q.compileSheets("../images/tmpsprites.png", "../data/tmpsprites.json");
    Q.compileSheets("../images/powerups.png", "../data/powerups.json");
    Q.stageScene("castleLevel");
}, {
    progressCallback: function (loaded, total) {
        var element = document.getElementById("loading_progress");
        element.style.width = Math.floor(loaded / total * 100) + "%";

        if (loaded === total) {
            document.getElementById("loading").remove();
        }
    }
});

Q.scene("castleLevel", function (stage) {
    Q.stageTMX("../data/castleLevel.tmx", stage);

    //move creation
    setUpObject.flag = new Q.Flag({
        x: 693,
        y: 557
    });

    stage.insert(setUpObject.flag);

    // Set up the socket connections.
    setUp(stage);
});

var roomName = sessionStorage.getItem("roomName")
var socket = io.connect("/game");
socket.emit("joinGame", {
    roomName: roomName,
    playerId: sessionStorage.getItem("playerId")
});

function createTableRowWithId(playerId, contents) {
    return "<tr id='" + playerId + "'>" + contents + "</tr>";
}

function createTableDataRow(playerId, gamePoints) {
    return "<td>" + playerId + "</td><td>" + gamePoints + "</td>";
}

function addSelf() {
    // Set this players unique id
    setUpObject.selfId = sessionStorage.getItem("playerId");

    // Create the actual player with this unique id
    setUpObject.player = new Q.Player({
        socket: socket,
        roomName: roomName,
        playerId: setUpObject.selfId,
        x: 300,
        y: 50
    });

    $("#scores > tbody:last-child").append(
        createTableRowWithId(setUpObject.selfId,
            createTableDataRow(setUpObject.selfId, 0)));

    // Insert this player into the stage
    setUpObject.stage.insert(setUpObject.player);

    // Add a camera  for this player
    setUpObject.stage.add("viewport").follow(setUpObject.player);

    setUpObject.flag.p.player = setUpObject.player;

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
    if (setUpObject.flag.p.shouldUpdatePoints) {
        socket.emit("points", {
            playerId: setUpObject.player.p.playerId,
            gamePoints: ++setUpObject.player.p.gamePoints
        });

        $("#scores #" + setUpObject.selfId).html(
            createTableDataRow(setUpObject.selfId,
                setUpObject.player.p.gamePoints));
    }
}

// setUp deals with communication over the socket
function setUp(stage) {
    setUpObject.stage = stage;

    addSelf();

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

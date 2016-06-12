var models = require("../app/models");

// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // If user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // If they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = function (app, passport) {
    // HOME
    app.get('/', function (req, res) {
        // load the index.ejs file
        res.render("index");
    });

    // LOGIN
    // Show the login form
    app.get("/login", function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render("login", {
            message: req.flash("loginMessage")
        });
    });

    // Process the login form
    app.post("/login", passport.authenticate("local-login", {
        successRedirect: "/lobby",
        failureRedirect: "/login",
        failureFlash: true
    }));

    // JOIN (ROOM)
    app.post("/join", function (req, res) {
        models.room.find({
            where: {
                id: req.body.room
            }
        }).then(function (room) {
            if (!models.room.validPassword(req.body.password, room.password)) {
                res.render("lobby", {
                    message: "Nope, that's not the password",
                    success: false,
                    user: req.user
                });
            } else {
                res.render("lobby", {
                    message: room.id,
                    success: true,
                    user: req.user
                });
            }
        })
    });

    // GUEST
    app.post("/guest", function (req, res, next) {
        req.user = {
            username: req.body.username,
            password: req.body.password
        };

        next();
    }, passport.authenticate("guest-signup", {
        successRedirect: "/lobby"
    }));

    // SIGNUP
    // Show the signup form
    app.get("/signup", function (req, res) {
        // Render the page and pass in any flash data if it exists
        res.render("signup", {
            message: req.flash("signupMessage")
        });
    });

    // Process the signup form
    app.post("/signup", passport.authenticate("local-signup", {
        successRedirect: "/lobby",
        failureRedirect: "/signup",
        failureFlash: true
    }));

    // LOBBY
    app.get("/lobby/data", isLoggedIn, function (req, res) {
        models.room.findAll().then(function (rooms) {
            res.json(rooms);
        });
    });

    app.get("/lobby", isLoggedIn, function (req, res) {
        models.users.update({
            roomId: null
        }, {
            where: {
                username: req.user.username
            }
        }).then(function () {
            res.render("lobby", {
                message: "",
                success: false,
                user: req.user
            });
        });
    });

    app.post("/lobby", isLoggedIn, function (req, res) {
        if (req.body.roomname) {
            models.room.find({
                where: {
                    name: req.body.roomname
                }
            }).then(function (rooms) {
                if (rooms) {
                    res.render("lobby", {
                        message: "Room is already taken",
                        user: req.user
                    });
                } else {
                    models.room.create({
                        id: req.body.roomname,
                        name: req.body.roomname,
                        winPoints: req.body.winPoints,
                        password: req.body.password,
                        players: 0
                    }).then(function() {
                        res.render("lobby", {
                            message: "",
                            success: false,
                            user: req.user
                        })
                    });
                }
            });
        } else {
            res.render("lobby", {
                message: "The room needs a name!",
                success: false,
                user: req.user
            });
        }
    });

    // ROOM
    app.put("/room/:roomname", isLoggedIn, function (req, res) {
        models.users.update({
            roomId: req.params.roomname
        }, {
            where: {
                username: req.user.username
            }
        });
    });

    app.get("/room/:roomname", isLoggedIn, function (req, res, next) {
        res.render("room", {
            roomname: req.params.roomname
        });
    });

    app.get("/room/:roomname/data", function (req, res) {
        models.users.findAll({
            where: {
                roomId: req.params.roomname
            }
        }).then(function (users) {
            res.json(users);
        });
    });

    // LOGOUT
    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // GAME
    app.get("/game", isLoggedIn, function (req, res) {
        res.render("game", {});
    });
};

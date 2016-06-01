var models = require('../app/models');

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
        res.render("index.ejs");
    });

    // LOGIN
    // Show the login form
    app.get("/login", function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render("login.ejs", {
            message: req.flash("loginMessage")
        });
    });

    // Process the login form
    app.post("/login", passport.authenticate("local-login", {
        successRedirect : "/lobby",
        failureRedirect : "/login",
        failureFlash : true
    }));

    // SIGNUP
    // Show the signup form
    app.get("/signup", function (req, res) {
        // Render the page and pass in any flash data if it exists
        res.render("signup.ejs", {
            message: req.flash("signupMessage")
        });
    });

    // Process the signup form
    app.post("/signup", passport.authenticate("local-signup", {
        successRedirect : "/lobby",
        failureRedirect : "/signup",
        failureFlash : true
    }));

    // PROFILE SECTION -- POSSIBLY TEMPORARY ONLY
    // We will want this protected so you have to be logged in to visit
    // We will use route middleware to verify this (the isLoggedIn function)
    app.get("/lobby", isLoggedIn, function (req, res) {
        models.room.findAll().then(function (rooms) {
            if (rooms) {
                res.render("lobby.ejs", {
                    message: "",
                    user: req.user,
                    rooms: rooms
                });
            } else {
                res.render("lobby.ejs", {
                    message: "",
                    user: req.user,
                    rooms: []
                });
            }
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
                    res.render("lobby.ejs", {
                        message: "Room is already taken",
                        user: req.user,
                        rooms: rooms
                    });
                } else {
                    models.room.create({
                        name: req.body.roomname,
                        players: 0
                    });

                    // Be put into the room (get room.ejs)
                }
            });
        }
    });

    app.delete("/lobby", function (req, res) {
        models.room.destroy({
            where: {
                name: req.body.roomname
            }
        });

        // Refresh rooms (May be done by AJAX)
    });

    // ROOM
    app.get("/room/:roomname", function (req, res) {
        res.render("room.ejs", {
            rooomname: roomname
        });
    });

    // LOGOUT
    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // GAME
    app.get("/game", function (req, res) {
        res.render("game.ejs", {});
    });
};

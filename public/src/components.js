Q.component("slow", {

    //this.entity is the player holding the component (do this.entity.p.speed to access the player's speed, etc)

    //Called when player.add("slow") happens
    added: function () {
        // Slow the player down to half speed as soon as component is added
        // Doing this, rather than set speed to 50, allows us to stack components on a player
        this.entity.p.speed = this.entity.p.speed / 2;
        //Will last for 5 seconds (60 frames per second)
        this.timeLeft = 5 * 60;
        //Whenever the entity steps, this component's step function will be called too
        this.entity.on("step", this, "step");
    },

    step: function (dt) {
        //If the player has had this component for long enough
        if (this.timeLeft == 0) {
            //Double the players speed back to what it would have been without this powerup
            this.entity.p.speed = this.entity.p.speed * 2;
            this.entity.p.del("slow");
        } else {
            timeLeft--;
        }
    }

    //Can add any other functions here that you might want to player.slow.function() on (Gun example is refillAmmo())

    //Can extend the player to have some more functions while this component is equipped (Gun example is fire())
});

Q.component("fast", {

    added: function () {
        // Double the players speed
        this.entity.p.speed = this.entity.p.speed * 2;
        this.timeLeft = 5 * 60;
        this.entity.on("step", this, "step");
    },

    step: function (dt) {
        if (this.timeLeft == 0) {
            this.entity.p.speed = this.entity.p.speed / 2;
            this.entity.p.del("fast");
        } else {
            timeLeft--;
        }
    }

});

Q.component("heavy", {

    added: function () {
        //Double the player's gravity
        this.entity.p.gravity = this.entity.p.gravity * 2;
        this.timeLeft = 5 * 60;
        this.entity.on("step", this, "step");
    },

    step: function (dt) {
        if (this.timeLeft == 0) {
            this.entity.p.gravity = this.entity.p.gravity / 2;
            this.entity.p.del("heavy");
        } else {
            timeLeft--;
        }
    }

});

Q.component("light", {

    added: function () {
        //Double the player's gravity
        this.entity.p.gravity = this.entity.p.gravity / 2;
        this.timeLeft = 5 * 60;
        this.entity.on("step", this, "step");
    },

    step: function (dt) {
        if (this.timeLeft == 0) {
            this.entity.p.gravity = this.entity.p.gravity * 2;
            this.entity.p.del("light");
        } else {
            timeLeft--;
        }
    }

});

Q.component("freeze", {

    added: function () {
        //Make velocity of player 0
        p.vx = 0;
        p.vy = 0;
        this.timeLeft = 5 * 60;
        this.entity.on("step", this, "step");
    },

    step: function (dt) {

        this.entity.p.direction = Q.inputs['left'] ? 'left' :
            Q.inputs['right'] ? 'right' :
            Q.inputs['up'] ? 'up' :
            Q.inputs['down'] ? 'down' : this.entity.p.direction;

        switch (p.direction) {
            case "left":
            case "right":
            case "up":
            case "down":
                p.vx = 0;
                p.vy = 0;
                break;

        }
        if (this.timeLeft == 0) {
            this.entity.p.del("freeze");
        } else {
            timeLeft--;
        }
    }

});

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
cxt = canvas.getContext("2d");

var keys = {
    left: false, right: false,
};

addEventListener("keydown", evt => {
    switch (evt.code) {
        case "ShiftLeft":
            keys.left = true;
            break;
        case "ShiftRight":
            keys.right = true;
            break;
    }
});

addEventListener("keyup", evt => {
    switch (evt.code) {
        case "ShiftLeft":
            keys.left = false;
            //console.log("left shift released.");
            break;
        case "ShiftRight":
            keys.right = false;
            //console.log("right shift released.");
            break;
    }
});

var time_survived = 0;

var player = {
    colour: "firebrick",
    x: window.innerWidth / 2, y: 500,
    radius: 4,
    update: function(lapse) {
        
    },
    
    reset: function() {
        this.x = window.innerWidth / 2;
        this.y = 500;
    }
};

var obstacles = [];
var density = 0.01;

function Obstacle(x, y, radius) {
    this.x = x; this.y = y;
    this.radius = radius;
}

Obstacle.prototype.colour = "silver";

Obstacle.prototype.update = function(lapse) {
    
};

var last_time = null, lapse = 0;
function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = time - last_time;
    }
    last_time = time;
    
    requestAnimationFrame(animate);
}

function start() {
    requestAnimationFrame(animate);
}
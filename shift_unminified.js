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
    jump_length: 10, jump_variation: 40,
    jumped_left: false, jumped_right: false,
    update: function(lapse) {
        /*
        this.x += this.speed * lapse * (keys.left ? -1 : 0);
        this.x += this.speed * lapse * (keys.right ? 1 : 0);
        */
        if (!this.jumped_left && keys.left) {
            this.jumped_left = true;
            console.log("jumped left");
            //jump to the left
            this.x -= this.jump_length + Math.random() * this.jump_variation;
        }
        
        if (!this.jumped_right && keys.right) {
            this.jumped_right = true;
            console.log("jumped right");
            this.x += this.jump_length + Math.random() * this.jump_variation; 
        }
        
        this.jumped_left = this.jumped_left && keys.left;
        this.jumped_right = this.jumped_right && keys.right;
        
        this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius));
    },
    
    reset: function() {
        this.x = window.innerWidth / 2;
        this.y = 500;
    }
};

var obstacles = [];
var density = 0.01;
var delay = 1000;

function Obstacle(x, y, radius) {
    this.x = x; this.y = y;
    this.radius = radius;
}

Obstacle.prototype.colour = "silver";

Obstacle.prototype.update = function(lapse) {
    
};

function draw() {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    obstacles.forEach(o => {
        cxt.fillStyle = o.colour;
        cxt.beginPath();
        cxt.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
        cxt.closePath();
        cxt.fill();
    })
    
    cxt.fillStyle = player.colour;
    cxt.beginPath();
    cxt.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    cxt.closePath();
    cxt.fill();
}

var last_time = null, lapse = 0;
var playing = false;
function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = time - last_time;
    }
    last_time = time;
    
    if (playing) {
        player.update(lapse);
        obstacles.forEach(o => { o.update(lapse); });
        requestAnimationFrame(animate);
    }
    
    draw();
}

function start(evt) {
    if (evt.key == "Shift") {
        document.getElementById("instructions").style.visibility = "hidden";
        playing = true;
        requestAnimationFrame(animate);
        removeEventListener("keyup", start);
    }
}

cxt.fillStyle = player.colour;
cxt.beginPath();
cxt.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
cxt.closePath();
cxt.fill();

addEventListener("keyup", start);
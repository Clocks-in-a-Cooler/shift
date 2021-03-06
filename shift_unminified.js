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
            //console.log("jumped left");
            //jump to the left
            this.x -= this.jump_length + Math.random() * this.jump_variation;
            ZZFX.z(57087);
        }
        
        if (!this.jumped_right && keys.right) {
            this.jumped_right = true;
            //console.log("jumped right");
            this.x += this.jump_length + Math.random() * this.jump_variation;
            ZZFX.z(57087);
        }
        
        this.jumped_left = this.jumped_left && keys.left;
        this.jumped_right = this.jumped_right && keys.right;
        
        this.x = Math.max(this.radius, Math.min(this.x, canvas.width - this.radius));
        
        //check for collision with the obstacles
        obstacles.forEach(o => {
            var actual_distance = Math.hypot(this.x - o.x, this.y - o.y);
            var minimum_distance = this.radius + o.radius;
            
            if (actual_distance <= minimum_distance) {
                ZZFX.z(21486);
                end();
            }
        });
    },
    
    reset: function() {
        this.x = window.innerWidth / 2;
        this.y = 500;
    }
};

var obstacles = [];
var density = 0.01; //?
var spawn_delay = 100;
var last_spawn = 0;

function Obstacle(x, radius) {
    this.x = x; this.y = 0;
    this.radius = (isNaN(radius) || radius < 5) ? 5 : radius;
    this.active = true;
}

Obstacle.prototype.colour = "silver";
Obstacle.prototype.speed = function() {
    //start at 0.2, approach 0.8
    //some nasty formula I worked out.
    return 0.4 + (0.8 / Math.PI) * Math.atan(9 * (time_survived / 60000 - 1));
};

Obstacle.prototype.update = function(lapse) {
    this.y += lapse * this.speed();
    if (this.y > canvas.height) {
        this.active = false;
    }
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
    
    /*
    cxt.fillStyle = "dodgerblue"; //I just love this colour, don't I?
    cxt.font = "18pt sans-serif";
    cxt.alignText = "left";
    cxt.textBaseLine = "top";
    cxt.fillText("score: " + Math.floor(time_survived / 1000) + " | obstacle speed: " + Obstacle.prototype.speed(), 5, 50);
    */
}

var last_time = null, lapse = 0, max_lapse = 100;
var playing = false;
function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = time - last_time;
    }
    last_time = time;
    
    if (lapse > max_lapse) {
        //console.log("lapse (" + lapse + " ms) too long! setting lapse to " + max_lapse);
        lapse = max_lapse;
    }
    
    if (playing) {
        time_survived += lapse;
        last_spawn += lapse;
        if (last_spawn > spawn_delay) {
            last_spawn = 0;
            obstacles.push(new Obstacle(Math.random() * canvas.width, 10));
        }
        player.update(lapse);
        obstacles = obstacles.filter( o => o.active);
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

function end() {
    document.getElementById("instructions").innerHTML = "press SHIFT to restart.";
    document.getElementById("instructions").innerHTML += "<br />score: " + Math.floor(time_survived / 1000);
    document.getElementById("instructions").style.visibility = "visible";
    playing = false;
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    cxt.fillStyle = player.colour;
    cxt.beginPath();
    cxt.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    cxt.closePath();
    cxt.fill();
    reset();
    addEventListener("keyup", start);
}

function reset() {
    last_time = null;
    player.reset();
    last_spawn = 0;
    time_survived = 0;
    obstacles = [];
}

cxt.fillStyle = player.colour;
cxt.beginPath();
cxt.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
cxt.closePath();
cxt.fill();

addEventListener("keyup", start);
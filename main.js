const canvas = document.getElementById("game-area");
const ctx = canvas.getContext('2d');

var bodies = [];
var count = 0;
const dt = 5;
const G = -10;
const H = canvas.clientHeight;
const W = canvas.clientWidth;
var center = [W/2, H/2];
var cbody = -1;
var zoom = 1;

class Body {
    constructor(x,y,m=1,vx=0,vy=0, d=1) {
        this.pos = [x, y];
        this.vel = [vx, vy];
        this.acc = [0, 0];
        this.m = m;
        this.d = d;
    }
    app_acc(ax, ay) {
        this.acc[0] += ax;
        this.acc[1] += ay;
    }
    access() {
        return [this.m, this.pos, this.vel, this.d];
    }
    
    update() {
        this.vel[0] += this.acc[0] * dt;
        this.vel[1] += this.acc[1] * dt;
        this.pos[0] += this.vel[0] * dt;
        this.pos[1] += this.vel[1] * dt;
        this.acc = [0, 0];
    }
}

// G - Gravitational const - No scaling (Same Units)
// 100 pixel = 1m
// 1 mass unit = 1kg
// 1 px/sec

function start() {
    clearScreen();
    addBody(0, 0, 1000, 0);
    addBody(1600, 0, 1, 0, 2.5);
    addBody(1650, 0, .1, 0, 2.9);
    addBody(1550, 0, .1, 0, 2.1);
    cbody = 1;
    gameLoop();
}
// IDKKD
function gameLoop() {
    clearScreen();
    requestAnimationFrame(gameLoop);
    for (var i = 0; i < count; i++) {
        for (var j = 0; j < count; j++) {
            if (i != j) {
                const dx = bodies[i].access()[1][0]-bodies[j].access()[1][0];
                const dy = bodies[i].access()[1][1]-bodies[j].access()[1][1];
                const d = Math.max(Math.sqrt(dx*dx+dy*dy), 1);
                const F = G * bodies[j].access()[0] / (d * d * d);
                bodies[i].app_acc(F*dx,F*dy);
            }
        }
    }
    for (var i = 0; i < count; i++) {
        bodies[i].update();
        drawId(i);
    }
    if (cbody != -1) {
        center = [-1*bodies[cbody].access()[1][0]*zoom+W/2, -1*bodies[cbody].access()[1][1]*zoom+H/2];
        console.log(center);
    }
}

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
}

function drawId(id) {
    if (id < count) {
        ctx.beginPath();
        ctx.arc(bodies[id].access()[1][0]*zoom+center[0], bodies[id].access()[1][1]*zoom+center[1], 10*Math.max(Math.min(zoom*Math.sqrt(bodies[id].access()[0]/bodies[id].access()[3]), 10),.02), 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
    }
}

function addBody(x,y,m=1,vx=0,vy=0, d=1) {
    bodies.push(new Body(x,y,m,vx,vy, d));
    count += 1;
}

start();
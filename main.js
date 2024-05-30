const canvas = document.getElementById("game-area");
const ctx = canvas.getContext('2d');

var bodies = [];
var count = 0;
const dt = 1;
const G = -10;
const H = canvas.clientHeight;
const W = canvas.clientWidth;
var center = [W/2, H/2];
var cbody = -1;
var zoom = .04;

class Body {
    constructor(x,y,m,vx,vy, d, name, color) {
        this.pos = [x, y];
        this.vel = [vx, vy];
        this.acc = [0, 0];
        this.m = m;
        this.d = d;
        this.name=name;
        this.color = color;
    }
    app_acc(ax, ay) {
        this.acc[0] += ax;
        this.acc[1] += ay;
    }
    access() {
        return [this.m, this.pos, this.vel, this.d];
    }
    access2() {
        return [this.name, this.color];
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
    const tj=Math.sqrt(10);
    const N = 360;

    addBody(0, 0, 10000, 0, -tj/100);
    addBody(10000, 0, 100, 0, tj, .1, "", "#FF0000");
    for (var i = 1; i < N; i++) {
        addBody(10000*Math.cos(2 * Math.PI * i / N), 10000*Math.sin(2 * Math.PI * i / N), 0, -tj*Math.sin(2 * Math.PI * i / N), tj*Math.cos(2 * Math.PI * i / N), 1, "", "#FFFFFF");
    }
    clearScreen();
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
    ctx.beginPath();
    const comx = (bodies[0].access()[0]*bodies[0].access()[1][0]+bodies[1].access()[0]*bodies[1].access()[1][0])/(bodies[1].access()[0]+bodies[0].access()[0]);
    const comy = (bodies[0].access()[0]*bodies[0].access()[1][1]+bodies[1].access()[0]*bodies[1].access()[1][1])/(bodies[1].access()[0]+bodies[0].access()[0]);
    ctx.arc(comx*zoom+center[0], 
            comy*zoom+center[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    console.log(comx, comy);
}

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
}

function drawId(id) {
    if (id < count) {
        ctx.beginPath();
        ctx.arc(bodies[id].access()[1][0]*zoom+center[0], bodies[id].access()[1][1]*zoom+center[1], 5*Math.max(Math.min(zoom*Math.sqrt(bodies[id].access()[0]/bodies[id].access()[3]), 1000),.2), 0, 2 * Math.PI);
        ctx.fillStyle = bodies[id].access2()[1];
        ctx.fill();
    }
}

function addBody(x,y,m=1,vx=0,vy=0, d=1, name="", color="#FFFFFF") {
    bodies.push(new Body(x,y,m,vx,vy, d, name, color));
    count += 1;
}

start();
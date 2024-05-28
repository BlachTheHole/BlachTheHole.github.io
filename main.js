const canvas = document.getElementById("game-area");
const ctx = canvas.getContext('2d');

var bodies = [];
var count = 0;
const dt = .1;
const G = -100;

class Body {
    constructor(x,y,m=1,vx=0,vy=0) {
        this.pos = [x, y];
        this.vel = [vx, vy];
        this.acc = [0, 0];
        this.m = m;
    }
    app_acc(ax, ay) {
        this.acc[0] += ax;
        this.acc[1] += ay;
    }
    access() {
        return [this.m, this.pos, this.vel];
    }
    
    update() {
        this.vel[0] += this.acc[0] * dt;
        this.vel[1] += this.acc[1] * dt;
        this.pos[0] += this.vel[0] * dt;
        this.pos[1] += this.vel[1] * dt;
        this.acc = [0, 0];
    }
}

function start() {
    clearScreen();
    addBody(800, 400, 100, 0, -.03);
    addBody(1000, 400, 1, 0, 3);
    gameLoop();
}
// IDKKD
function gameLoop() {
    requestAnimationFrame(gameLoop);
    for (var i = 0; i < count; i++) {
        for (var j = 0; j < count; j++) {
            if (i != j) {
                console.log(i, j);
                const dx = bodies[i].access()[1][0]-bodies[j].access()[1][0];
                const dy = bodies[i].access()[1][1]-bodies[j].access()[1][1];
                const d = Math.max(Math.sqrt(dx*dx+dy*dy), 1);
                const F = G * bodies[j].access()[0] / (d * d * d);
                console.log(F);
                bodies[i].app_acc(F*dx,F*dy);
            }
        }
    }
    for (var i = 0; i < count; i++) {
        bodies[i].update();
        drawId(i);
    }
}

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function drawId(id) {
    if (id < count) {
        ctx.beginPath();
        ctx.arc(bodies[id].access()[1][0], bodies[id].access()[1][1], 20, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
    }
}

function addBody(x,y,m=1,vx=0,vy=0) {
    bodies.push(new Body(x,y,m,vx,vy));
    count += 1;
}

start();
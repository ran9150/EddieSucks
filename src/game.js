const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const menu = document.getElementById('menu');
const hud = document.getElementById('hud');

let gameState = 'MENU';
let score = 0;
let player = { x: 0, y: 0, size: 30 };
let enemies = [];
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
}
window.addEventListener('resize', resize);
resize();

function spawnEnemy() {
    if (gameState !== 'PLAYING') return;
    enemies.push({ x: Math.random() * canvas.width, y: -50, size: 40, speed: 2 + Math.random() * 3 });
    setTimeout(spawnEnemy, 1000);
}

function createParticles(x, y) {
    for(let i=0; i<10; i++) particles.push({ x, y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, life: 1 });
}

function update() {
    if (gameState !== 'PLAYING') return;
    score++;
    scoreEl.innerText = Math.floor(score / 10);
    
    enemies.forEach((e, i) => {
        e.y += e.speed;
        if (e.y > canvas.height) enemies.splice(i, 1);
        if (Math.hypot(e.x - player.x, e.y - player.y) < 40) {
            gameState = 'MENU';
            menu.style.display = 'block';
            hud.style.display = 'none';
        }
    });
    
    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
    });
}

function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(player.x - 15, player.y - 15, 30, 30);
    
    ctx.fillStyle = '#ff4757';
    enemies.forEach(e => ctx.fillRect(e.x - 20, e.y - 20, 40, 40));
    
    ctx.fillStyle = 'white';
    particles.forEach(p => ctx.fillRect(p.x, p.y, 4, 4));
    
    requestAnimationFrame(() => { draw(); update(); });
}

window.addEventListener('mousemove', e => { player.x = e.clientX; });
window.addEventListener('touchmove', e => { player.x = e.touches[0].clientX; });
document.getElementById('startBtn').onclick = () => {
    gameState = 'PLAYING';
    score = 0;
    enemies = [];
    menu.style.display = 'none';
    hud.style.display = 'block';
    spawnEnemy();
};

draw();
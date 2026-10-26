const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const menu = document.getElementById('menu');
const hud = document.getElementById('hud');

let gameState = 'MENU';
let score = 0;
let level = 0;
let player = { x: 0, y: 0, size: 30 };
let enemies = [];
let particles = [];
let lastSpawn = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('mousemove', (e) => { player.x = e.clientX; });
window.addEventListener('touchmove', (e) => { player.x = e.touches[0].clientX; });

function spawnEnemy() {
    if (gameState !== 'PLAYING') return;
    const speedMultiplier = Math.pow(1.3, level);
    enemies.push({ 
        x: Math.random() * canvas.width, 
        y: -50, 
        size: 30, 
        speed: (2 + Math.random() * 3) * speedMultiplier 
    });
    
    let nextSpawn = 1000 / Math.pow(1.3, level);
    setTimeout(spawnEnemy, nextSpawn);
}

function update() {
    if (gameState !== 'PLAYING') return;

    // Score accumulation (1.5x faster)
    score += 0.15; 
    let newLevel = Math.floor(score / 100);
    if (newLevel > level) level = newLevel;
    scoreEl.innerText = Math.floor(score);

    enemies.forEach((e, i) => {
        e.y += e.speed;
        if (e.y > canvas.height) enemies.splice(i, 1);
        if (Math.hypot(e.x - player.x, e.y - player.y) < 40) gameState = 'MENU';
    });
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(player.x - 15, player.y - 15, 30, 30);
    
    ctx.fillStyle = 'white';
    enemies.forEach(e => ctx.fillRect(e.x - 15, e.y - 15, 30, 30));
    
    requestAnimationFrame(() => {
        update();
        draw();
    });
}

document.getElementById('startBtn').onclick = () => {
    gameState = 'PLAYING';
    menu.style.display = 'none';
    hud.style.display = 'block';
    score = 0;
    level = 0;
    enemies = [];
    spawnEnemy();
};

draw();
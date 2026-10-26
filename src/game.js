const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');
const menu = document.getElementById('menu');
const deathScreen = document.getElementById('death-screen');
const hud = document.getElementById('hud');
const playerColorInput = document.getElementById('playerColor');

let gameState = 'MENU';
let score = 0;
let player = { x: 0, y: 0, size: 40, color: '#00d2d3' };
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

function resetGame() {
    score = 0;
    enemies = [];
    particles = [];
    player.color = playerColorInput.value;
    gameState = 'PLAYING';
    menu.style.display = 'none';
    deathScreen.style.display = 'none';
    hud.style.display = 'block';
    scoreEl.innerText = '0';
}

document.getElementById('startBtn').onclick = resetGame;
document.getElementById('restartBtn').onclick = resetGame;
document.getElementById('homeBtn').onclick = () => {
    deathScreen.style.display = 'none';
    menu.style.display = 'block';
    gameState = 'MENU';
};

window.addEventListener('mousemove', (e) => { if(gameState === 'PLAYING') player.x = e.clientX; });
window.addEventListener('touchmove', (e) => { if(gameState === 'PLAYING') player.x = e.touches[0].clientX; });

function update() {
    if (gameState !== 'PLAYING') return;
    
    const level = Math.floor(score / 100);
    const spawnRate = Math.max(200, 1000 / (1 + level * 0.3));
    
    if (Date.now() - lastSpawn > spawnRate) {
        enemies.push({ x: Math.random() * canvas.width, y: -50, size: 30, speed: (5 + level * 1.3) });
        lastSpawn = Date.now();
    }

    score += 0.05 * (1 + level * 0.5);
    scoreEl.innerText = Math.floor(score);

    enemies.forEach((e, i) => {
        e.y += e.speed;
        if (e.y > canvas.height) enemies.splice(i, 1);
        if (Math.hypot(e.x - player.x, e.y - player.y) < 40) {
            gameState = 'GAMEOVER';
            finalScoreEl.innerText = Math.floor(score);
            deathScreen.style.display = 'block';
            hud.style.display = 'none';
        }
    });
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'PLAYING') {
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ff4757';
        enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));
    }
    requestAnimationFrame(() => { update(); draw(); });
}
draw();
const character = document.getElementById("character");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const jumpBtn = document.getElementById('jumpBtn');

const jumpSound = new Audio("audio/jump.mp3");
const hitSound = new Audio("audio/hit.mp3");
const bgMusic = new Audio("audio/ambience.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.45;

let score = 0;
let highscore = 0;
let gameRunning = false;
let position = 0;
let velocity = 0;
let gravity = -0.425;
let jumping = false;
let obstacleleft = 900;
let obstacleSpeed = 4;
let moveInterval = null;
let gameLoopInterval = null;

function showPreGameAlert() {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert-box');
    alertBox.innerHTML = `
        <div>ทำคะแนนให้ได้ 10 คะแนนเพื่อรับของรางวัล!</div>
        <button id="alertBtn">ตกลง</button>
    `;
    document.body.appendChild(alertBox);
    
    document.getElementById('alertBtn').addEventListener('click', () => {
        alertBox.remove();
        startGame();
    });
    startBtn.style.display = 'none';
}

function startGame() {
    score = 0;
    velocity = 0;
    position = 0;
    obstacleleft = 900;
    obstacleSpeed = 4;
    gameRunning = true;
    jumping = false;

    character.style.bottom = position + "px";
    obstacle.style.left = obstacleleft + "px";
    obstacle.style.display = "block";

    scoreDisplay.textContent = "คะแนน : 0";
    highscoreDisplay.textContent = "คะแนนสูงสุด : " + highscore;

    startBtn.style.display = "none";
    resetBtn.style.display = "none";
    jumpBtn.style.display = "block";

    bgMusic.play();
    gameLoop();
    moveObstacle();
}

function gameLoop() {
    gameLoopInterval = setInterval(() => {
        velocity += gravity;
        position += velocity;

        if (position < 0) {
            position = 0;
            velocity = 0;
            jumping = false;
        }
        character.style.bottom = position + "px";
        checkCollision();
    }, 20);
}

function moveObstacle() {
    moveInterval = setInterval(() => {
        if (!gameRunning) return;

        obstacleleft -= obstacleSpeed;
        obstacle.style.left = obstacleleft + "px";

        if (obstacleleft <= -70) { 
            obstacleleft = window.innerWidth;
            score++;
            scoreDisplay.textContent = "คะแนน : " + score;
            if (score > highscore) {
                highscore = score;
                highscoreDisplay.textContent = "คะแนนสูงสุด : " + highscore;
            }
        }

        obstacleSpeed += 0.002; 
    }, 20);
}

function checkCollision() {
    const characterRect = character.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
        characterRect.right > obstacleRect.left &&
        characterRect.left < obstacleRect.right &&
        characterRect.bottom > obstacleRect.top
    ) {
        gameOver();
    }
}

function gameOver() {
    gameRunning = false;
    clearInterval(moveInterval);
    clearInterval(gameLoopInterval);
    hitSound.play();
    bgMusic.pause();
    bgMusic.currentTime = 0;
    
    resetBtn.style.display = "inline";
    startBtn.style.display = "none";
    jumpBtn.style.display = "none";
}

function jump() {
    if (!jumping && gameRunning) {
        velocity = 13.874;
        jumping = true;
        jumpSound.play();
    }
}

jumpBtn.addEventListener('click', jump);
jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

startBtn.addEventListener("click", showPreGameAlert);

resetBtn.addEventListener("click", () => {
    resetBtn.style.display = "none";
    startBtn.style.display = "inline";
    jumpBtn.style.display = "none";
});

document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = "https://quintxyz.github.io/Area51/";
});

document.addEventListener('DOMContentLoaded', () => {
    startBtn.style.display = 'inline';
    resetBtn.style.display = 'none';
    jumpBtn.style.display = 'none';
});

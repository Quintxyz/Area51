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

    startBtn.disabled = true;
    resetBtn.style.display = "none";

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

        if (obstacleleft <= -70) { // กำหนดตามขนาด obstacle ใหม่
            obstacleleft = 900;
            score++;
            scoreDisplay.textContent = "คะแนน : " + score;
            if (score > highscore) {
                highscore = score;
                highscoreDisplay.textContent = "คะแนนสูงสุด : " + highscore;
            }
        }

        obstacleSpeed += 0.002; // เร่งสปีดช้าๆ
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
}

function jump() {
    if (!jumping && gameRunning) {
        velocity = 13.874; //
        jumping = true;
        jumpSound.play();
    }
}

document.addEventListener("keydown", e => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        jump();
    }
});

jumpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", () => {
    startBtn.disabled = false;
    resetBtn.style.display = "none";
});

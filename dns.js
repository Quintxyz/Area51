const dino = document.getElementById("dino");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

let score = 0;
let highscore = 0;
let gameRunning = false;
let position = 0;
let velocity = 0;
let gravity = -0.6;
let jumping = false;
let obstacleleft = 600;
let obstacleSpeed = 5;
let moveInterval = null;
let gameLoopInterval = null;

function startGame(){
    score = 0;
    velocity = 0;
    position = 0;
    obstacleleft = 600;
    obstacleSpeed = 3;
    gameRunning = true;
    jumping = false;

    dino.style.bottom = position + "px";

    obstacle.style.left = obstacleleft + "px";
    obstacle.style.display = "block";

    scoreDisplay.textContent = "คะแนน : 0";
    highscoreDisplay.textContent = "คะแนนสูงสุด : " + highscore;

    startBtn.disabled = true;
    resetBtn.style.display = "none";

    gameLoop();
    moveObstacle();

}

function gameLoop(){
    gameLoopInterval = setInterval( ()=>{
        velocity += gravity;
        position +=velocity;

        if (position < 0){
            position = 0;
            velocity = 0;
            jumping = false;
        }
        dino.style.bottom = position + "px";

        checkCollision();

    }, 20

    );
}

function moveObstacle(){
    moveInterval = setInterval( () => {
        if (!gameRunning) return;

        obstacleleft -= obstacleSpeed;
        obstacle.style.left = obstacleleft + "px";

        if (obstacleleft <= -40) {
            obstacleleft = 600;
            score++;
            scoreDisplay.textContent = "คะแนน : " + score;
            if( score > highscore){
                highscore = score;
                highscoreDisplay.textContent = "คะแนนสูงสุด : " + highscore;
            }
        
        }
        obstacleSpeed += 0.001;
    } , 20

    );
}

function checkCollision(){
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    if (
        dinoRect.right > obstacleRect.left && 
        dinoRect.left < obstacleRect.right && 
        dinoRect.bottom > obstacleRect.top
    ){
        gameOver();
    }
}

function gameOver(){
    gameRunning = false;
    clearInterval(moveInterval);
    clearInterval(gameLoopInterval);
    resetBtn.style.display = "inline";
}

function jump(){
    if(!jumping && gameRunning){
        velocity = 12;
        jumping = true;
    }
}

document.addEventListener("keydown", e =>{
    if (e.code ==="Space" || e.code ==="ArrowUp"){
        jump();
    }
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", ()=>{
    startBtn.disabled = false;
    resetBtn.style.display = "none";
});

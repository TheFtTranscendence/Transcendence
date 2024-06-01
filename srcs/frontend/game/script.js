// Canvas Vars
const ratio = window.devicePixelRatio;
const canvas = document.getElementById("game-area");

canvas.width = 800 * ratio;
canvas.height = 600 * ratio;
canvas.style.width = 800 + "px";
canvas.style.height = 600 + "px";
const ctx = canvas.getContext("2d");

let gameStart = false;
let gameOver = false;
let gameReset = false;
let pointScored = false;

// Paddle Vars
let p1PaddleState = { up: false, down: false }
let p2PaddleState = { up: false, down: false }

let paddleHeight = 80;
let paddleWidth = 10;
let paddleSpeed = 6;

let p1paddleX = 20; 
let p1paddleY = (canvas.height / 2) - (paddleHeight / 2);

let p2paddleX = canvas.width - 30;
let p2paddleY =  (canvas.height / 2) - (paddleHeight / 2);

// Ball Vars
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSize = 7;
let ballSpeedX = 5;
let ballSpeedY = 0;
let ballMoveRight = false;
let ballMoveLeft = false;
let hitCounter = 0;
let speedIncY = 3;

// Score Vars
let p1Score = 0;
let p2Score = 0;

// Button Vars
const buttonX = (canvas.width / 2) - 80;
const buttonY = (canvas.height / 2) - 35;
const buttonWidth = 160;
const buttonHeight = 70;

window.onload = function() {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("click", handleCanvasClick)
    setInterval(gameLoop, 1000/60);
}

function handleKeyUp(event) {
    if (event.key === "w") {
        p1PaddleState.up = false;
    } else if (event.key === "s") {
        p1PaddleState.down = false;
    } else if (event.key === "ArrowUp") {
        p2PaddleState.up = false;
    } else if (event.key === "ArrowDown") {
        p2PaddleState.down = false;
    }
}

function handleKeyDown(event) {
    if (event.key === "w") {
        p1PaddleState.up = true;
    } else if (event.key === "s") {
        p1PaddleState.down = true;
    } else if (event.key === "ArrowUp") {
        p2PaddleState.up = true;
    } else if (event.key === "ArrowDown") {
        p2PaddleState.down = true;
    }
}

function handleCanvasClick(event)
{
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // console.log(x);
    // console.log(y);
    // // console.log(buttonX);
    // // console.log(buttonY);
    // console.log(canvas.width);
    // console.log(canvas.height);
    if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight && !gameStart)
    {
        gameStart = true;
        p1Score = 0;
        p2Score = 0;
    }
}

function updatePaddles()
{
    if (p1PaddleState.up === true && p1paddleY > 2)
        p1paddleY -= paddleSpeed;
    if (p1PaddleState.down === true && (p1paddleY + paddleHeight + paddleSpeed) < canvas.height)
        p1paddleY += paddleSpeed;
    if (p2PaddleState.up === true && p2paddleY > 2)
        p2paddleY -= paddleSpeed;
    if (p2PaddleState.down === true && (p2paddleY + paddleHeight + paddleSpeed) < canvas.height)
        p2paddleY += paddleSpeed;

}

function ballMovement()
{
    if (pointScored)
    {
        if (ballMoveRight)
        {
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            if (ballX > canvas.width)
            {
                pointScored = false;
                gameReset = true;        
            }
        }
        else if (ballMoveLeft)
        {
            ballX -= ballSpeedX;
            ballY += ballSpeedY;
            if (ballX < 0)
            {
                pointScored = false;
                gameReset = true;
            }
        }
        return ;
    }
    if (ballMoveRight === false && ballMoveLeft === false)
    {
        ballX += ballSpeedX;
        ballMoveRight = true;
    }
    else if (ballMoveRight === true)
    {
        if ((ballX + ballSize + ballSpeedX) < p2paddleX)
        {
            ballX += ballSpeedX;
            if ((ballY + ballSpeedY) < 2)
                ballSpeedY *= -1;
            else if ((ballY + ballSpeedY) > canvas.height)
                ballSpeedY *= -1;
            ballY += ballSpeedY;
        }
        else
        {
            if (ballY >= p2paddleY && ballY <= (p2paddleY + paddleHeight))
            {
                if (hitCounter % 5 == 0)
                {
                    ballSpeedX++;
                    speedIncY++;
                    ballSpeedY = (Math.random() * speedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
                }
                ballX -= ballSpeedX;
                console.log("vballspeed : ", ballSpeedY);
                ballY += ballSpeedY;
                ballMoveRight = false;
                ballMoveLeft = true;
                hitCounter++;
            }
            else
            {
                pointScored = true;
                ballX += ballSpeedX;
                p1Score++;
            }          
        }
    }
    else if (ballMoveLeft === true)
    {
        if ((ballX + ballSpeedX) > (p1paddleX + paddleWidth))
        {
            ballX -= ballSpeedX;
            if ((ballY + ballSpeedY) < 2)
                ballSpeedY *= -1;
            else if ((ballY + ballSpeedY) > canvas.height)
                ballSpeedY *= -1;
            ballY += ballSpeedY;
        }
        else
        {
            if (ballY >= p1paddleY && ballY <= (p1paddleY + paddleHeight))
            {
                if (hitCounter % 5 == 0)
                {
                    ballSpeedX++;
                    speedIncY++;
                    ballSpeedY = (Math.random() * speedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
                }
                ballX += ballSpeedX;
                ballY += ballSpeedY;
                ballMoveLeft = false;
                ballMoveRight = true;
                hitCounter++;
            }
            else
            {
                pointScored = true;
                ballX -= ballSpeedX;
                p2Score++;
            }
        }
    }
    
}


function resetGame()
{
    p1paddleX = 20; 
    p1paddleY = (canvas.height / 2) - (paddleHeight / 2);
    p2paddleX = canvas.width - 30;
    p2paddleY =  (canvas.height / 2) - (paddleHeight / 2);
    
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 0;
    hitCounter = 0;
    speedIncY = 3;

    if (p1Score >= 5 || p2Score >= 5)
    {
        gameStart = false;
        return ;
    }

    gameReset = false;
}

function drawPaddle(x, y)
{
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y)
{
    ctx.beginPath();
    ctx.arc(x, y, ballSize, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
}

function drawGame()
{
    drawPaddle(p1paddleX, p1paddleY);
    drawPaddle(p2paddleX, p2paddleY);
    drawBall(ballX, ballY);

    ctx.fillText(p1Score, 20, 50);
    ctx.fillText("SCORE", (canvas.width / 2) - 70, 50);
    ctx.fillText(p2Score, canvas.width - 40, 50);
}

function drawButton(text, x, y, width, height, size)
{
    let textMetrics = ctx.measureText(text);
    let textWidth = textMetrics.width;
    let textX = x + (width / 2) - (textWidth / 2);
    let textY = y + (height / 2) + (size / 2) - 5;

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "black";
    ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    ctx.fillStyle = "white";
    ctx.font = size + "px ARCADECLASSIC";
    ctx.fillText(text, textX, textY);
    ctx.fillStyle = "white";
}

function endGame()
{
    ctx.fillStyle = "white";
    if (p1Score === 5)
        ctx.fillText("PLAYER 1 WINS !", (canvas.width / 2) - 100, (canvas.height / 2) - 130);
    else if (p2Score === 5)
        ctx.fillText("PLAYER 2 WINS !", (canvas.width / 2) - 100, (canvas.height / 2) - 130);
    drawButton("RESTART", (canvas.width / 2) - 80, (canvas.height / 2) - 35, 160, 70, 30);
}

function gameLoop(event)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // console.log(canvas.width);
    // console.log(canvas.height);
    if (!gameStart)
    {
        if (!gameReset)
            drawButton("START", (canvas.width / 2) - 80, (canvas.height / 2) - 35, 160, 70, 40);
        else
        {
            endGame();
            drawButton("RESTART", (canvas.width / 2) - 80, (canvas.height / 2) - 35, 160, 70, 30);
        }
    }
    else
    {
        if (gameReset)
            resetGame();
        
        if (!gameStart)
        {
            return ;
        }

        updatePaddles();
    
        ballMovement();
    
        drawGame();
    }
}


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

let p1paddleX = 40; 
let p1paddleY = (canvas.height / 2) - (paddleHeight / 2);

let p2paddleX = canvas.width - 50;
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

window.onload = startGame();

function startGame()
{
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

    if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight && !gameStart)
    {
        gameStart = true;
        p1Score = 0;
        p2Score = 0;
    }
}

function updatePaddles()
{
    if (p1PaddleState.up === true && p1paddleY > 1)
        p1paddleY -= paddleSpeed;
    if (p1PaddleState.down === true && (p1paddleY + paddleHeight) < canvas.height)
        p1paddleY += paddleSpeed;
    if (p2PaddleState.up === true && p2paddleY > 1)
        p2paddleY -= paddleSpeed;
    if (p2PaddleState.down === true && (p2paddleY + paddleHeight) < canvas.height)
        p2paddleY += paddleSpeed;

}

function ballMovement()
{
    // If point has been scored make ball travel out of screen
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
            if ((ballY - (ballSize / 2)) < 0 || (ballY + (ballSize / 2)) >= canvas.height)
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
                }
                ballSpeedY = (Math.random() * speedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
                ballX -= ballSpeedX;
                // console.log("vballspeed : ", ballSpeedY);
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
        // Ball didn't hit the paddle X
        if ((ballX - ballSpeedX) > (p1paddleX + paddleWidth))
        {
            ballX -= ballSpeedX;
            if ((ballY - (ballSize / 2)) < 0 || (ballY + (ballSize / 2)) >= canvas.height)
                ballSpeedY *= -1;
            ballY += ballSpeedY;
        }
        // Ball hit the pladdle X
        else
        {
            // Check if hit the paddle Y
            if (ballY >= p1paddleY && ballY <= (p1paddleY + paddleHeight))
            {
                if (hitCounter % 5 == 0)
                {
                    ballSpeedX++;
                    speedIncY++;
                }
                ballSpeedY = (Math.random() * speedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
                // console.log("vballspeed : ", ballSpeedY);
                ballX += ballSpeedX;
                ballY += ballSpeedY;
                ballMoveLeft = false;
                ballMoveRight = true;
                hitCounter++;
            }
            // Didn't hit the paddle Y - Point Scored
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
    p1paddleX = 40; 
    p1paddleY = (canvas.height / 2) - (paddleHeight / 2);
    p2paddleX = canvas.width - 50;
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

function drawPaddle(x, y, color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y)
{
    ctx.beginPath();
    ctx.arc(x, y, ballSize, 0, Math.PI * 2);
    if (x > (canvas.width / 2 - 10))
        ctx.fillStyle = "blue";
    else
        ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.stroke();
}

function drawBackground()
{
    let it = 0;
    ctx.fillStyle = "white";
    for (let y = 10; y < canvas.height; y += 40)
        {
            it++;
            if (it === 2)
                drawText("white", "40px ARCADECLASSIC", "SCORE", (canvas.width / 2) - 55, y + 20);
            else
                ctx.fillRect((canvas.width / 2 - 10), y, 20, 20);        
    }
    drawText("red", "50px Verdana", p1Score, (canvas.width / 2) - 130, 75);
    drawText("BLUE", "50px Verdana", p2Score, (canvas.width / 2) + 100, 75);
}

function drawText(color, font, text, x, y)
{
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, x, y);
}

function drawGame()
{
    drawBackground();
    drawPaddle(p1paddleX, p1paddleY, "red");
    drawPaddle(p2paddleX, p2paddleY, "blue");
    drawBall(ballX, ballY);
}

function drawButton(text, x, y, width, height, size, font)
{
    ctx.font = size + "px " + font;
    let textMetrics = ctx.measureText(text);
    let textWidth = textMetrics.width;
    let textX = x + (width / 2) - (textWidth / 2);
    let textY = y + (height / 2) + (size / 2) - 5;

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "black";
    ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    drawText("white", size + "px " + font, text, textX, textY);
}

function endGame()
{
    if (p1Score === 5)
        drawText("red", "50px ARCADECLASSIC", "PLAYER 1 WINS !", (canvas.width / 2) - 160, (canvas.height / 2) - 130)
    else if (p2Score === 5)
        drawText("blue", "50px ARCADECLASSIC", "PLAYER 2 WINS !", (canvas.width / 2) - 160, (canvas.height / 2) - 130)

    drawButton("RESTART", (canvas.width / 2) - 80, (canvas.height / 2) - 35, 160, 70, 30, "ARCADECLASSIC");
}

function gameLoop(event)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!gameStart)
    {
        if (!gameReset)
            drawButton("START", (canvas.width / 2) - 80, (canvas.height / 2) - 35, 160, 70, 40, "ARCADECLASSIC");
        else
            endGame();
    }
    else
    {
        // Reset paddle and ball position
        if (gameReset)
            resetGame();
        
        // Reset game and shows restart screen
        if (!gameStart)
        {
            return ;
        }

        updatePaddles();
        ballMovement();
        drawGame();
    }
}


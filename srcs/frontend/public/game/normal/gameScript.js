function game_hashchange(vars)
{
	if (vars.running == true)
	{
		console.log('hashchange game');
		window.removeEventListener("hashchange", game_hashchange);
	
		document.getElementById('game').classList.add('hidden');
	
		window.removeEventListener("keydown", handleKeyDown);
		window.removeEventListener("keyup", handleKeyUp);
		vars.canvasVars.canvas.removeEventListener("click", handleCanvasClick);
	
		clearInterval(vars.IntervalVars.gameLoop);
		UnloadScripts(window.gameScripts);

		vars.running = false;
	}
}


function init()
{
    const vars = initVars();

	console.log('initing game');
	document.getElementById('game').classList.remove('hidden');

	// When leaving this hash (#game), trigger game_hashchange function
	window.addEventListener("hashchange", (event) => {game_hashchange(vars)});
	
	
    window.addEventListener("keydown", (event) => handleKeyDown(event, vars));
    window.addEventListener("keyup", (event) => handleKeyUp(event, vars));
    vars.canvasVars.canvas.addEventListener("click", (event) => handleCanvasClick(event, vars));
   	vars.IntervalVars.gameLoop = setInterval(() => gameLoop(vars), 1000 / 60);
}


function initVars()
{
    const canvasVars = {
        ratio: window.devicePixelRatio,
        canvas: document.getElementById("game-area"),
        ctx: null,
        canvasWidth: 800,
        canvasHeight: 600
    }

    canvasVars.canvas.style.width = canvasVars.canvasWidth + "px";
    canvasVars.canvas.style.height = canvasVars.canvasHeight + "px";
    canvasVars.canvas.width = canvasVars.canvasWidth * canvasVars.ratio;
    canvasVars.canvas.height = canvasVars.canvasHeight * canvasVars.ratio;
    canvasVars.ctx = canvasVars.canvas.getContext("2d");
    canvasVars.ctx.scale(canvasVars.ratio, canvasVars.ratio);

    const gameVars = {
        gameStart: false,
        gameOver: false,
        gameReset: false,
        pointScored: false,
        p1Score: 0,
        p2Score: 0
    }

    const paddleHeight = 80;

    const paddleVars = {
        p1PaddleState: { up: false, down: false },
        p2PaddleState: { up: false, down: false },
        paddleHeight: paddleHeight,
        paddleWidth: 10,
        paddleSpeed: 6,
        p1paddleX: 40,
        p1paddleY: (canvasVars.canvasHeight / 2) - (paddleHeight / 2),
        p2paddleX: canvasVars.canvasWidth - 50,
        p2paddleY: (canvasVars.canvasHeight / 2) - (paddleHeight / 2)
    }

    const ballVars = {
        ballX: canvasVars.canvasWidth / 2,
        ballY: canvasVars.canvasHeight / 2,
        ballSize: 7,
        ballSpeedX: 5,
        ballSpeedY: 0,
        ballMoveRight: false,
        ballMoveLeft: false,
        ballHitCounter: 0,
        ballSpeedIncY: 3
    }

    const buttonVars = {
        buttonX: (canvasVars.canvasWidth / 2) - 80,
        buttonY: (canvasVars.canvasHeight / 2) - 35,
        buttonWidth: 160,
        buttonHeight: 70
    }

	const IntervalVars = {
		gameLoop: null
	}

    const vars =  {
        canvasVars: canvasVars,
        gameVars: gameVars,
        paddleVars: paddleVars,
        ballVars: ballVars,
        buttonVars: buttonVars,
		IntervalVars: IntervalVars,
		running: true
    }

    return vars;
}

// Handle keyUp State
function handleKeyUp(event, vars) {
    if (event.key === "w") {
        vars.paddleVars.p1PaddleState.up = false;
    } else if (event.key === "s") {
        vars.paddleVars.p1PaddleState.down = false;
    } else if (event.key === "ArrowUp") {
        vars.paddleVars.p2PaddleState.up = false;
    } else if (event.key === "ArrowDown") {
        vars.paddleVars.p2PaddleState.down = false;
    }
}

// Handle keyDown State
function handleKeyDown(event, vars) {
    if (event.key === "w") {
        vars.paddleVars.p1PaddleState.up = true;
    } else if (event.key === "s") {
        vars.paddleVars.p1PaddleState.down = true;
    } else if (event.key === "ArrowUp") {
        vars.paddleVars.p2PaddleState.up = true;
    } else if (event.key === "ArrowDown") {
        vars.paddleVars.p2PaddleState.down = true;
    }
}

// get mouse click in canvas
function handleCanvasClick(event, vars)
{
    const rect = vars.canvasVars.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= vars.buttonVars.buttonX && x <= vars.buttonVars.buttonX + vars.buttonVars.buttonWidth && y >= vars.buttonVars.buttonY && y <= vars.buttonVars.buttonY + vars.buttonVars.buttonHeight && !vars.gameVars.gameStart)
    {
        vars.gameVars.gameStart = true;
        vars.gameVars.p1Score = 0;
        vars.gameVars.p2Score = 0;
    }
}

function updatePaddles(vars)
{
    if (vars.paddleVars.p1PaddleState.up === true && vars.paddleVars.p1paddleY > 1)
        vars.paddleVars.p1paddleY -= vars.paddleVars.paddleSpeed;
    if (vars.paddleVars.p1PaddleState.down === true && (vars.paddleVars.p1paddleY + vars.paddleVars.paddleHeight) < vars.canvasVars.canvasHeight)
        vars.paddleVars.p1paddleY += vars.paddleVars.paddleSpeed;
    if (vars.paddleVars.p2PaddleState.up === true && vars.paddleVars.p2paddleY > 1)
        vars.paddleVars.p2paddleY -= vars.paddleVars.paddleSpeed;
    if (vars.paddleVars.p2PaddleState.down === true && (vars.paddleVars.p2paddleY + vars.paddleVars.paddleHeight) < vars.canvasVars.canvasHeight)
        vars.paddleVars.p2paddleY += vars.paddleVars.paddleSpeed;
}

function ballMovement(vars)
{
    // If point has been scored make ball travel out of screen
    if (vars.gameVars.pointScored)
    {
        if (vars.ballVars.ballMoveRight)
        {
            vars.ballVars.ballX += vars.ballVars.ballSpeedX;
            vars.ballVars.ballY += vars.ballVars.ballSpeedY;
            if (vars.ballVars.ballX > vars.canvasVars.canvasWidth)
            {
                vars.gameVars.pointScored = false;
                vars.gameVars.gameReset = true;        
            }
        }
        else if (vars.ballVars.ballMoveLeft)
        {
            vars.ballVars.ballX -= vars.ballVars.ballSpeedX;
            vars.ballVars.ballY += vars.ballVars.ballSpeedY;
            if (vars.ballVars.ballX < 0)
            {
                vars.gameVars.pointScored = false;
                vars.gameVars.gameReset = true;
            }
        }
        return ;
    }
    // Define initial ball direction
    if (vars.ballVars.ballMoveRight === false && vars.ballVars.ballMoveLeft === false)
    {
        vars.ballVars.ballX += vars.ballVars.ballSpeedX;
        vars.ballVars.ballMoveRight = true;
    }
    else if (vars.ballVars.ballMoveRight === true)
    {
        // Ball didn't hit the paddle X
        if ((vars.ballVars.ballX + vars.ballVars.ballSize + vars.ballVars.ballSpeedX) < vars.paddleVars.p2paddleX)
        {
            vars.ballVars.ballX += vars.ballVars.ballSpeedX;
            if ((vars.ballVars.ballY - (vars.ballVars.ballSize / 2)) < 0 || (vars.ballVars.ballY + (vars.ballVars.ballSize / 2)) >= vars.canvasVars.canvasHeight)
                vars.ballVars.ballSpeedY *= -1;
            vars.ballVars.ballY += vars.ballVars.ballSpeedY;
        }
        // Ball hit the pladdle X
        else
        {
            // Check if hit the paddle Y
            if (vars.ballVars.ballY >= vars.paddleVars.p2paddleY && vars.ballVars.ballY <= (vars.paddleVars.p2paddleY + vars.paddleVars.paddleHeight))
            {
                if (vars.ballVars.ballHitCounter % 5 == 0)
                {
                    vars.ballVars.ballSpeedX++;
                    vars.ballVars.ballSpeedIncY++;
                }
                vars.ballVars.ballSpeedY = (Math.random() * vars.ballVars.ballSpeedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
                vars.ballVars.ballX -= vars.ballVars.ballSpeedX;
                vars.ballVars.ballY += vars.ballVars.ballSpeedY;
                vars.ballVars.ballMoveRight = false;
                vars.ballVars.ballMoveLeft = true;
                vars.ballVars.ballHitCounter++;
            }
            // Didn't hit the paddle Y - Point Scored
            else
            {
                vars.gameVars.pointScored = true;
                vars.ballVars.ballX += vars.ballVars.ballSpeedX;
                vars.gameVars.p1Score++;
            }          
        }
    }
    else if (vars.ballVars.ballMoveLeft === true)
    {
        // Ball didn't hit the paddle X
        if ((vars.ballVars.ballX - vars.ballVars.ballSpeedX) > (vars.paddleVars.p1paddleX + vars.paddleVars.paddleWidth))
        {
            vars.ballVars.ballX -= vars.ballVars.ballSpeedX;
            if ((vars.ballVars.ballY - (vars.ballVars.ballSize / 2)) < 0 || (vars.ballVars.ballY + (vars.ballVars.ballSize / 2)) >= vars.canvasVars.canvasHeight)
                vars.ballVars.ballSpeedY *= -1;
            vars.ballVars.ballY += vars.ballVars.ballSpeedY;
        }
        // Ball hit the pladdle X
        else
        {
            // Check if hit the paddle Y
            if (vars.ballVars.ballY >= vars.paddleVars.p1paddleY && vars.ballVars.ballY <= (vars.paddleVars.p1paddleY + vars.paddleVars.paddleHeight))
            {
                if (vars.ballVars.ballHitCounter % 5 == 0)
                {
                    vars.ballVars.ballSpeedX++;
                    vars.ballVars.ballSpeedIncY++;
                }
                vars.ballVars.ballSpeedY = (Math.random() * vars.ballVars.ballSpeedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
                vars.ballVars.ballX += vars.ballVars.ballSpeedX;
                vars.ballVars.ballY += vars.ballVars.ballSpeedY;
                vars.ballVars.ballMoveLeft = false;
                vars.ballVars.ballMoveRight = true;
                vars.ballVars.ballHitCounter++;
            }
            // Didn't hit the paddle Y - Point Scored
            else
            {
                vars.gameVars.pointScored = true;
                vars.ballVars.ballX -= vars.ballVars.ballSpeedX;
                vars.gameVars.p2Score++;
            }
        }
    }
}

function resetGame(vars)
{
    vars.paddleVars.p1paddleX = 40; 
    vars.paddleVars.p1paddleY = (vars.canvasVars.canvasHeight / 2) - (vars.paddleVars.paddleHeight / 2);
    vars.paddleVars.p2paddleX = vars.canvasVars.canvasWidth - 50;
    vars.paddleVars.p2paddleY = (vars.canvasVars.canvasHeight / 2) - (vars.paddleVars.paddleHeight / 2);
    
    vars.ballVars.ballX = vars.canvasVars.canvasWidth / 2;
    vars.ballVars.ballY = vars.canvasVars.canvasHeight / 2;
    vars.ballVars.ballSpeedX = 5;
    vars.ballVars.ballSpeedY = 0;
    vars.ballVars.ballHitCounter = 0;
    vars.ballVars.ballSpeedIncY = 3;

    if (vars.gameVars.p1Score >= 5 || vars.gameVars.p2Score >= 5)
    {
        vars.gameVars.gameStart = false;
        return ;
    }

    vars.gameVars.gameReset = false;
}

function drawPaddle(x, y, color, vars)
{
    vars.canvasVars.ctx.fillStyle = color;
    vars.canvasVars.ctx.fillRect(x, y, vars.paddleVars.paddleWidth, vars.paddleVars.paddleHeight);
}

function drawBall(x, y, vars)
{
    vars.canvasVars.ctx.beginPath();
    vars.canvasVars.ctx.arc(x, y, vars.ballVars.ballSize, 0, Math.PI * 2);
    if (x > (vars.canvasVars.canvasWidth / 2 - 10))
        vars.canvasVars.ctx.fillStyle = "blue";
    else
        vars.canvasVars.ctx.fillStyle = "red";
    vars.canvasVars.ctx.fill();
    vars.canvasVars.ctx.lineWidth = 1;
    vars.canvasVars.ctx.strokeStyle = "white";
    vars.canvasVars.ctx.stroke();
}

function drawBackground(vars)
{
    let it = 0;
    vars.canvasVars.ctx.fillStyle = "white";
    for (let y = 10; y < vars.canvasVars.canvasHeight; y += 40)
        {
            it++;
            if (it === 2)
                drawText("white", "40px ARCADECLASSIC", "SCORE", (vars.canvasVars.canvasWidth / 2) - 55, y + 20, vars);
            else
            vars.canvasVars.ctx.fillRect((vars.canvasVars.canvasWidth / 2 - 10), y, 20, 20);        
    }
    drawText("red", "50px Verdana", vars.gameVars.p1Score, (vars.canvasVars.canvasWidth / 2) - 130, 75, vars);
    drawText("BLUE", "50px Verdana", vars.gameVars.p2Score, (vars.canvasVars.canvasWidth / 2) + 100, 75, vars);
}

function drawText(color, font, text, x, y, vars)
{
    vars.canvasVars.ctx.fillStyle = color;
    vars.canvasVars.ctx.font = font;
    vars.canvasVars.ctx.fillText(text, x, y);
}

function drawGame(vars)
{
    drawBackground(vars);
    drawPaddle(vars.paddleVars.p1paddleX, vars.paddleVars.p1paddleY, "red", vars);
    drawPaddle(vars.paddleVars.p2paddleX, vars.paddleVars.p2paddleY, "blue", vars);
    drawBall(vars.ballVars.ballX, vars.ballVars.ballY, vars);
}

function drawButton(text, x, y, width, height, size, font, vars)
{
    vars.canvasVars.ctx.font = size + "px " + font;
    let textMetrics = vars.canvasVars.ctx.measureText(text);
    let textWidth = textMetrics.width;
    let textX = x + (width / 2) - (textWidth / 2);
    let textY = y + (height / 2) + (size / 2) - 5;

    vars.canvasVars.ctx.fillStyle = "white";
    vars.canvasVars.ctx.fillRect(x, y, width, height);
    vars.canvasVars.ctx.fillStyle = "black";
    vars.canvasVars.ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    drawText("white", size + "px " + font, text, textX, textY, vars);
}

function endGame(vars)
{
    if (vars.gameVars.p1Score === 5)
        drawText("red", "50px ARCADECLASSIC", "PLAYER 1 WINS !", (vars.canvasVars.canvasWidth / 2) - 160, (vars.canvasVars.canvasHeight / 2) - 130, vars)
    else if (vars.gameVars.p2Score === 5)
        drawText("blue", "50px ARCADECLASSIC", "PLAYER 2 WINS !", (vars.canvasVars.canvasWidth / 2) - 160, (vars.canvasVars.canvasHeight / 2) - 130, vars)

    drawButton("RESTART", (vars.canvasVars.canvasWidth / 2) - 80, (vars.canvasVars.canvasHeight / 2) - 35, 160, 70, 30, "ARCADECLASSIC", vars);
}

function gameLoop(vars)
{
    // vars.canvasVars.ctx.scale(canvasVars.ratio, canvasVars.ratio);
    vars.canvasVars.ctx.clearRect(0, 0, vars.canvasVars.canvasWidth, vars.canvasVars.canvasHeight);
    vars.canvasVars.ctx.fillStyle = "black";
    vars.canvasVars.ctx.fillRect(0, 0, vars.canvasVars.canvasWidth, vars.canvasVars.canvasHeight);
    if (!vars.gameVars.gameStart)
    {
        if (!vars.gameVars.gameReset)
            drawButton("START", (vars.canvasVars.canvasWidth / 2) - 80, (vars.canvasVars.canvasHeight / 2) - 35, 160, 70, 40, "ARCADECLASSIC", vars);
        else
            endGame(vars);
    }
    else
    {
        // Reset paddle and ball position after point scored
        if (vars.gameVars.gameReset)
            resetGame(vars);
        
        // Reset game and shows restart screen
        if (!vars.gameVars.gameStart)
        {
            return ;
        }

        updatePaddles(vars);
        ballMovement(vars);
        drawGame(vars);
    }
}


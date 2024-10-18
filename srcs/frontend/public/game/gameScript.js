function game_hashchange(vars)
{
	window.removeEventListener("hashchange", vars.eventHandlers.eventHashChange);
	if (vars.gameVars.matchmakingGame)
	{
		window.removeEventListener("keyup", vars.eventHandlers.eventKeyUpMatchmaking);
		window.removeEventListener("keydown", vars.eventHandlers.eventKeyDownMatchmaking);
		vars.canvasVars.canvas.removeEventListener("click", vars.eventHandlers.eventCanvasClickMatchmaking);
		clearInterval(vars.IntervalVars.lobbyLoop);
		vars.mm.game_socket.close()
	}
	else
	{
		window.removeEventListener("keyup", vars.eventHandlers.eventKeyUpLocal);
		window.removeEventListener("keydown", vars.eventHandlers.eventKeyDownLocal);
		vars.canvasVars.canvas.removeEventListener("click", vars.eventHandlers.eventCanvasClickLocal);
	}

	// window.isGameActive = false
	clearInterval(vars.IntervalVars.gameLoop);
	document.getElementById('game').classList.add('hidden');
	unloadScripts(window.gameScripts);

	vars.running = false;
}

async function cleanUpAfterFinish(vars)
{
	
	if (vars.gameVars.matchmakingGame)
	{
		window.removeEventListener("keyup", vars.eventHandlers.eventKeyUpMatchmaking);
		window.removeEventListener("keydown", vars.eventHandlers.eventKeyDownMatchmaking);
		vars.canvasVars.canvas.removeEventListener("click", vars.eventHandlers.eventCanvasClickMatchmaking);
		clearInterval(vars.IntervalVars.lobbyLoop);
		await storeMatch(vars);
		vars.mm.game_socket.close()
	}
	else
	{
		window.removeEventListener("keyup", vars.eventHandlers.eventKeyUpLocal);
		window.removeEventListener("keydown", vars.eventHandlers.eventKeyDownLocal);
		vars.canvasVars.canvas.removeEventListener("click", vars.eventHandlers.eventCanvasClickLocal);
		await storeMatch(vars);
		if (vars.gameVars.tournamentGame && pongyTournamentData.tournamentEnd)
		{
			pongyTournamentData.finalTournament = await getFinalTournamentPongy()
			window.storeTournamentBlockchainPongy()
		}
	}

	window.removeEventListener("hashchange", vars.eventHandlers.eventHashChange);
	clearInterval(vars.IntervalVars.gameLoop);

	window.gamesOnCounter--;
	// window.isGameActive = false
	await unloadScripts(window.gameScripts);
	
	vars.running = false;
	document.getElementById('game').classList.add('hidden');
		
	if (vars.gameVars.tournamentGame) {
		loadScripts(window.tournamentScripts);
		tournament_loop();
	}
	else {
		loadScripts(window.menuScripts);
		main_menu();
	}

}

async function storeMatch(vars)
{
	players = [
		vars.gameVars.p1Name,
		vars.gameVars.p2Name,
	]
	scores = [
		vars.gameVars.p1Score,
		vars.gameVars.p2Score,
	]

	if (vars.gameVars.tournamentGame)
	{
		if (vars.gameVars.p1Score > vars.gameVars.p2Score) {
			pongyTournamentData.addGameWinner(vars.gameVars.p1Name, vars.gameVars.p1SkinId)
		}
		else {
			pongyTournamentData.addGameWinner(vars.gameVars.p2Name, vars.gameVars.p2SkinId)
		}
		
		pongyTournamentData.setMatchAsPlayed(players)

		const url = 'https://' + window.IP + ':3000/online-games/tournaments/' + pongyTournamentData.id + '/games/';

		const game = {
			"users": players,
			"scores": scores,
		}

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const data = await response.json();
            if (data.status === "completed") {
                pongyTournamentData.tournamentEnd = true;
            }

        } catch (error) {
            throw new Error(error.message);
        }

	}
	else
	{
		const url = `https://${window.IP}:3000/solidity/solidity/addgame/${window.user.blockchain_id}/Pongy`;

		const data = {
			players: players,
			scores: scores,
		};

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		.then(response => {
			// Check if the response is successful (status 200-299)
			if (response.ok) {
				return response.json();  // Parse JSON response
			} else {
				throw new Error(`Error: ${response.status} ${response.statusText}`);
			}
		})
		.then(responseData => {
			// Log success and the data returned by the server (if any)
			console.log("Game stored successfully:", responseData);
		})
		.catch(error => {
			
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})
			.then(response => {
				// Check if the response is successful (status 200-299)
				if (response.ok) {
					return response.json();  // Parse JSON response
				} else {
					throw new Error(`Error: ${response.status} ${response.statusText}`);
				}
			})
			.then(responseData => {
				// Log success and the data returned by the server (if any)
				console.log("Game stored successfully:", responseData);
			})
			.catch(error => {
				// Log any error that happens during the fetch request
				console.error("Error storing the game:", error);
			});

		});
	}
}

function loadImage(src, callback)
{
	const img = new Image();
	img.onload = callback;
	img.src = src;
	return img;
}

function startGame(p1Name, p2Name, p1Skin, p2Skin, p1SkinId, p2SkinId, tournamentGame)
{
	const vars = initVars();

	vars.gameVars.tournamentGame = tournamentGame;

	vars.gameVars.p1Name = p1Name;
	vars.gameVars.p2Name = p2Name;
	vars.gameVars.p1SkinId = p1SkinId;
	vars.gameVars.p2SkinId = p2SkinId;
	vars.paddleVars.p1PaddleSkin.src = p1Skin;
	vars.paddleVars.p2PaddleSkin.src = p2Skin;
	vars.paddleVars.p1SkinPath = p1Skin;
	vars.paddleVars.p2SkinPath = p2Skin;
	vars.ballVars.ballSkin.src = "game/assets/ball.png";

	document.getElementById('game').classList.remove('hidden');

	// When leaving this hash (#game), trigger game_hashchange function
	window.addEventListener("hashchange", vars.eventHandlers.eventHashChange);

	
	window.addEventListener("keyup", vars.eventHandlers.eventKeyUpLocal);
	window.addEventListener("keydown", vars.eventHandlers.eventKeyDownLocal);
	vars.canvasVars.canvas.addEventListener("click", vars.eventHandlers.eventCanvasClickLocal);

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
		gameFinish: false,
		gameOver: false,
		gameReset: false,
		pointScored: false,
		tournamentGame: false,
		matchmakingGame: false,
		p1Score: 0,
		p2Score: 0,
		p1Name: "",
		p2Name: "",
		p1SkinId: 0,
		p2SkinId: 0,
		maxPoints: 2
	}

	const mm = {
		queue_socket: null,
		game_socket: null,
		player1: 0,
		player2: 0,
		gameId: 0,
		p1SkinId: 0,
		p2SkinId: 0
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
		p2paddleY: (canvasVars.canvasHeight / 2) - (paddleHeight / 2),
		p1PaddleSkin: new Image(),
		p2PaddleSkin: new Image(),
		p1SkinPath: "",
		p2SkinPath: ""
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
		ballSpeedIncY: 3,
		ballSkin: new Image(),
		nextBallDir: 0
	}

	const buttonVars = {
		buttonX: (canvasVars.canvasWidth / 2) - 80,
		buttonY: (canvasVars.canvasHeight / 2) - 35,
		buttonWidth: 160,
		buttonHeight: 70,
		buttonState: 0
	}

	const IntervalVars = {
		lobbyLoop: null,
		gameLoop: null
	}

	const eventHandlers = {
		eventKeyUpMatchmaking: (event) => handleKeyUpMatchmaking(event, vars),
		eventKeyDownMatchmaking: (event) => handleKeyDownMatchmaking(event, vars),
		eventCanvasClickMatchmaking: (event) => handleCanvasClickMatchmaking(event, vars),
		eventKeyUpLocal: (event) => handleKeyUp(event, vars),
		eventKeyDownLocal: (event) => handleKeyDown(event, vars),
		eventCanvasClickLocal: (event) => handleCanvasClick(event, vars),
		eventHashChange: (event) => game_hashchange(vars)

	}

	const vars =  {
		canvasVars: canvasVars,
		gameVars: gameVars,
		mm: mm,
		paddleVars: paddleVars,
		ballVars: ballVars,
		buttonVars: buttonVars,
		IntervalVars: IntervalVars,
		eventHandlers: eventHandlers,
		running: true
	}

	return vars;
}

// Local keys
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
		if (vars.gameVars.gameFinish)
		{
			cleanUpAfterFinish(vars)
		}
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
		if ((vars.ballVars.ballX + vars.ballVars.ballSize + vars.ballVars.ballSpeedX) < (vars.paddleVars.p2paddleX - 5))
		{
			vars.ballVars.ballX += vars.ballVars.ballSpeedX;
			if ((vars.ballVars.ballY - (vars.ballVars.ballSize / 2)) < -5 || (vars.ballVars.ballY + (vars.ballVars.ballSize / 2)) >= (vars.canvasVars.canvasHeight - 20))
				vars.ballVars.ballSpeedY *= -1;
			vars.ballVars.ballY += vars.ballVars.ballSpeedY;
		}
		// Ball hit the pladdle X
		else
		{
			// Check if hit the paddle Y
			if (vars.ballVars.ballY >= (vars.paddleVars.p2paddleY - 10) && vars.ballVars.ballY <= (vars.paddleVars.p2paddleY + vars.paddleVars.paddleHeight - 10))
			{
				if (vars.ballVars.ballHitCounter % 5 == 0)
				{
					vars.ballVars.ballSpeedX++;
					vars.ballVars.ballSpeedIncY++;
				}
				if (vars.gameVars.matchmakingGame)
				{
					vars.ballVars.ballSpeedY = vars.ballVars.nextBallDir;
					const temp = (Math.random() * vars.ballVars.ballSpeedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
					if (vars.gameVars.p1Name === window.user.username)
					{
						vars.mm.game_socket.send(JSON.stringify({
							"action": "game_info",
							"info": {
								"nextBallDir": temp
							},
						}));
					}						
				}
				else
				{
					vars.ballVars.ballSpeedY = (Math.random() * vars.ballVars.ballSpeedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
				}				
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
		if ((vars.ballVars.ballX - vars.ballVars.ballSpeedX) > (vars.paddleVars.p1paddleX + vars.paddleVars.paddleWidth - 20))
		{
			vars.ballVars.ballX -= vars.ballVars.ballSpeedX;
			if ((vars.ballVars.ballY - (vars.ballVars.ballSize / 2)) < -5 || (vars.ballVars.ballY + (vars.ballVars.ballSize / 2)) >= (vars.canvasVars.canvasHeight - 20))
				vars.ballVars.ballSpeedY *= -1;
		}
		// Ball hit the pladdle X
		else
		{
			// Check if hit the paddle Y
			if (vars.ballVars.ballY >= (vars.paddleVars.p1paddleY - 10) && vars.ballVars.ballY <= (vars.paddleVars.p1paddleY + vars.paddleVars.paddleHeight - 10))
			{
				if (vars.ballVars.ballHitCounter % 5 == 0)
				{
					vars.ballVars.ballSpeedX++;
					vars.ballVars.ballSpeedIncY++;
				}
				if (vars.gameVars.matchmakingGame)
				{
					vars.ballVars.ballSpeedY = vars.ballVars.nextBallDir;
					const temp = (Math.random() * vars.ballVars.ballSpeedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
					if (vars.gameVars.p1Name === window.user.username)
					{
						vars.mm.game_socket.send(JSON.stringify({
							"action": "game_info",
							"info": {
								"nextBallDir": temp
							},
						}));
					}	
				}
				else
				{
					vars.ballVars.ballSpeedY = (Math.random() * vars.ballVars.ballSpeedIncY - 1) * (Math.random() < 0.5 ? 1 : -1);
				}
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

	vars.paddleVars.p1PaddleSkin = null;
	vars.paddleVars.p2PaddleSkin = null;
	vars.ballVars.ballSkin = null;

	vars.paddleVars.p1PaddleSkin = new Image();
	vars.paddleVars.p2PaddleSkin = new Image();
	vars.ballVars.ballSkin = new Image();

	if (vars.gameVars.matchmakingGame)
	{
		vars.paddleVars.p1PaddleSkin.src = window.game1Skins[vars.mm.p1SkinId];
		vars.paddleVars.p2PaddleSkin.src = window.game1Skins[vars.mm.p2SkinId];
	}
	else
	{
		vars.paddleVars.p1PaddleSkin.src = vars.paddleVars.p1SkinPath;
		vars.paddleVars.p2PaddleSkin.src = vars.paddleVars.p2SkinPath;
	}
	vars.ballVars.ballSkin.src = "game/assets/ball.png";

	if (vars.gameVars.p1Score >= vars.gameVars.maxPoints || vars.gameVars.p2Score >= vars.gameVars.maxPoints)
	{
		vars.gameVars.gameStart = false;
		return ;
	}

	vars.gameVars.gameReset = false;
}

function drawPaddle(x, y, skin, vars)
{
	vars.canvasVars.ctx.drawImage(skin, x, y, vars.paddleVars.paddleWidth, vars.paddleVars.paddleHeight);

}

function drawBall(x, y, vars)
{
	vars.canvasVars.ctx.drawImage(vars.ballVars.ballSkin, x, y, vars.ballVars.ballSize + 20, vars.ballVars.ballSize + 20);
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
	drawText("white", "50px Arial", vars.gameVars.p1Score, (vars.canvasVars.canvasWidth / 2) - 130, 75, vars);
	drawText("white", "50px Arial", vars.gameVars.p2Score, (vars.canvasVars.canvasWidth / 2) + 100, 75, vars);
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
	drawPaddle(vars.paddleVars.p1paddleX, vars.paddleVars.p1paddleY, vars.paddleVars.p1PaddleSkin, vars);
	drawPaddle(vars.paddleVars.p2paddleX, vars.paddleVars.p2paddleY, vars.paddleVars.p2PaddleSkin, vars);
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
	if (vars.gameVars.p1Score === vars.gameVars.maxPoints)
	{
		drawText("red", "50px ARCADECLASSIC", vars.gameVars.p1Name + " WINS !", (vars.canvasVars.canvasWidth / 2) - 160, (vars.canvasVars.canvasHeight / 2) - 130, vars)
	}
	else if (vars.gameVars.p2Score === vars.gameVars.maxPoints)
	{
		drawText("blue", "50px ARCADECLASSIC", vars.gameVars.p2Name + " WINS !", (vars.canvasVars.canvasWidth / 2) - 160, (vars.canvasVars.canvasHeight / 2) - 130, vars)
	}
	vars.gameVars.gameFinish = true;
	drawButton("FINISH", (vars.canvasVars.canvasWidth / 2) - 80, (vars.canvasVars.canvasHeight / 2) - 35, 160, 70, 30, "ARCADECLASSIC", vars);
}

function gameLoop(vars)
{
	vars.canvasVars.ctx.clearRect(0, 0, vars.canvasVars.canvasWidth, vars.canvasVars.canvasHeight);
	vars.canvasVars.ctx.fillStyle = "black";
	vars.canvasVars.ctx.fillRect(0, 0, vars.canvasVars.canvasWidth, vars.canvasVars.canvasHeight);
	if (!vars.gameVars.gameStart)
	{
		if (!vars.gameVars.gameReset)
		{
			if (!vars.gameVars.matchmakingGame)
				drawButton("START", (vars.canvasVars.canvasWidth / 2) - 80, (vars.canvasVars.canvasHeight / 2) - 35, 160, 70, 40, "ARCADECLASSIC", vars);

		}
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

		drawText("white", "30px ARCADECLASSIC", vars.gameVars.p1Name, 50, 50, vars);
		drawText("white", "30px ARCADECLASSIC", vars.gameVars.p2Name, (vars.canvasVars.canvasWidth - 100), 50, vars);
		updatePaddles(vars);
		ballMovement(vars);
		drawGame(vars);
	}
}

/* --------> MATCHMAKING FUCS <-------- */

function startMatchmakingQueue()
{
	joinQueue("Pongy", startMatchmakingLobby)
}

function startMatchmakingLobby(data)
{
	const vars = initVars();
	vars.gameVars.matchmakingGame = true;
	vars.mm.gameId = data.game_id;
	
	Matchmaking_setup_socket(vars)


}

function initMatchmakingGame(vars, data)
{
	vars.gameVars.p1Name = data.users_info[0].username;
	vars.gameVars.p2Name = data.users_info[1].username;
	vars.mm.p1SkinId = data.users_info[0].user_info.skin_id
	vars.mm.p2SkinId = data.users_info[1].user_info.skin_id
	vars.paddleVars.p1PaddleSkin.src = window.game1Skins[vars.mm.p1SkinId];
	vars.paddleVars.p2PaddleSkin.src = window.game1Skins[vars.mm.p2SkinId];
	vars.ballVars.ballSkin.src = "game/assets/ball.png";
		
		
	
	window.addEventListener("keyup", vars.eventHandlers.eventKeyUpMatchmaking);
	window.addEventListener("keydown", vars.eventHandlers.eventKeyDownMatchmaking);
	vars.canvasVars.canvas.addEventListener("click", vars.eventHandlers.eventCanvasClickMatchmaking);
	vars.IntervalVars.gameLoop = setInterval(() => gameLoop(vars), 1000 / 60);
}

function Matchmaking_setup_socket(vars) {
	
	vars.mm.game_socket = new WebSocket(`wss://${window.IP}:3000/online-games/ws/games/${vars.mm.gameId}/`);
	
	vars.mm.game_socket.onopen = function(event) {
		document.getElementById('game').classList.remove('hidden');
		window.addEventListener("hashchange", vars.eventHandlers.eventHashChange);
		vars.canvasVars.canvas.addEventListener("click", vars.eventHandlers.eventCanvasClickMatchmaking);
		vars.IntervalVars.lobbyLoop = setInterval(() => matchmakingLobby(vars), 1000 / 60);
	}

	vars.mm.game_socket.onmessage = function(event) {
		msg = JSON.parse(event.data)
		if (msg.type === "GameReady")
		{
			clearInterval(vars.IntervalVars.lobbyLoop);
			initMatchmakingGame(vars, msg)
		}
		else if (msg.type === "move") {

			switch (msg.move) {
	
				case 'ArrowUp_keydown': vars.paddleVars.p2PaddleState.up = true; break;
				case 'ArrowUp_keyup': vars.paddleVars.p2PaddleState.up = false; break;
				case 'ArrowDown_keydown': vars.paddleVars.p2PaddleState.down = true; break;
				case 'ArrowDown_keyup': vars.paddleVars.p2PaddleState.down = false; break;
	
				case 'w_keydown': vars.paddleVars.p1PaddleState.up = true; break;
				case 'w_keyup': vars.paddleVars.p1PaddleState.up = false; break;
				case 's_keydown': vars.paddleVars.p1PaddleState.down = true; break;
				case 's_keyup':vars.paddleVars.p1PaddleState.down = false; break;
			}
		}
		else if (msg.type === "game_info") {
			vars.ballVars.nextBallDir = msg.info.nextBallDir;
		}
	}
}

function matchmakingLobby(vars)
{
	if (vars.buttonVars.buttonState === 0)
	{
		drawButton("READY", (vars.canvasVars.canvasWidth / 2) - 80, (vars.canvasVars.canvasHeight / 2) - 35, 160, 70, 40, "ARCADECLASSIC", vars);
	}
	else
	{
		drawButton("WAIT", (vars.canvasVars.canvasWidth / 2) - 80, (vars.canvasVars.canvasHeight / 2) - 35, 160, 70, 40, "ARCADECLASSIC", vars);
	}
}

// Matchmaking keys
// Handle keyUp State
function handleKeyUpMatchmaking(event, vars) {
	if (vars.gameVars.p1Name === window.user.username)
	{
		if (event.key === "w") {
			vars.mm.game_socket.send(JSON.stringify({action:"move", move:"w_keyup"}))
		} else if (event.key === "s") {
			vars.mm.game_socket.send(JSON.stringify({action:"move", move:"s_keyup"}))
		}
	}
	else {	
		if (event.key === "w") {
			vars.mm.game_socket.send(JSON.stringify({action:"move", move:"ArrowUp_keyup"}))
		} else if (event.key === "s") {
			vars.mm.game_socket.send(JSON.stringify({action:"move", move:"ArrowDown_keyup"}))
		}
	}
}

// Handle keyDown State
function handleKeyDownMatchmaking(event, vars) {
	if (vars.gameVars.p1Name === window.user.username)
	{
		if (event.key === "w") {
			vars.mm.game_socket.send(JSON.stringify({action:"move", move:"w_keydown"}))
		} else if (event.key === "s") {
			vars.mm.game_socket.send(JSON.stringify({action:"move", move:"s_keydown"}))
		}
	}
	else
	{
		if (event.key === "w") {
			vars.mm.game_socket.send(JSON.stringify({action:"move", move:"ArrowUp_keydown"}))
		} else if (event.key === "s") {
			vars.mm.game_socket.send(JSON.stringify({action:"move", move:"ArrowDown_keydown"}))
		}
	}
}

// get mouse click in canvas
function handleCanvasClickMatchmaking(event, vars)
{
	const rect = vars.canvasVars.canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	if (x >= vars.buttonVars.buttonX && x <= vars.buttonVars.buttonX + vars.buttonVars.buttonWidth && y >= vars.buttonVars.buttonY && y <= vars.buttonVars.buttonY + vars.buttonVars.buttonHeight && !vars.gameVars.gameStart)
	{
		if (vars.gameVars.gameFinish)
		{

			window.gamesOnCounter++;
			cleanUpAfterFinish(vars)
		}
		if (vars.buttonVars.buttonState === 0)
		{
			vars.mm.game_socket.send(JSON.stringify({
				"action": "ready",
				"user": window.user.id,
				"username": window.user.username,
				"blockchain_id": window.user.blockchain_id,
				"user_info": {
					"skin_id": window.user.preferences.pongy_skin
				}
			}));
			vars.buttonVars.buttonState = 1
			vars.canvasVars.canvas.removeEventListener("click", vars.eventHandlers.eventCanvasClickMatchmaking);
		}

	
		vars.gameVars.gameStart = true;
		vars.gameVars.p1Score = 0;
		vars.gameVars.p2Score = 0;
	}
}


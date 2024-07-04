window.onload = startGame2;

function startGame2()
{
    const vars = initVars();
	startSetup();
	
    // document.addEventListener("keydown", (event) => handleKeyDown(event, vars));
    // document.addEventListener("keyup", (event) => handleKeyUp(event, vars));
    // vars.canvasVars.canvas.addEventListener("click", (event) => handleCanvasClick(event, vars));
    setInterval(() => gameLoop(vars), 1000 / 60);
	
}

function initVars()
{
    const cv = {
        canvas: document.getElementById("game2-area"),
		c: canvas.getContext("2d"),
        width: 1024,
        height: 576
    }
}

function startSetup()
{

	cv.c.fillRect(0, 0, cv.width, cv.height);

}
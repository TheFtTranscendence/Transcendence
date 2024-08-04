// Global variables for Menu/Game scripts
window.tournamentOn = false;
window.menuCreated = false;

window.shuflledNickList = [];
window.nextMatch =  {
    player1: "",
    player2: ""
}
window.loser = "";
window.winner = "";

// window.nextPlayer1 = "";
// window.nextPlayer2 = "";
window.gamesPerRound = 0;
window.gameRound = 1;
window.gameRounMax = 0;

function removeScripts()
{
    const currentScript = document.currentScript;
    const allScripts = document.querySelectorAll('script');

    allScripts.forEach(script => {
        if (script !== currentScript) {
            script.parentNode.removeChild(script);
        }
    })
}

function restoreGameCanvas()
{
    const gameMenuDiv = document.getElementById("menuPage");
    let gameCanvas = document.getElementById("gameArea");

    if (gameCanvas)
    {
        gameMenuDiv.removeChild(gameCanvas);
        gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'gameArea';
        gameCanvas.classList.add('hidden');
        gameMenuDiv.appendChild(gameCanvas);
    }

}

function findNextMatch()
{
    // if (window.gameRound === 1)
    // {
        // window.nextMatch.player1 = window.shuffleNickNames[window.gamesPerRound];
        // window.nextMatch.player1 = window.shuffleNickNames[window.gamesPerRound + 1];
    // }
    // else
    // {

    // }
    console.log("gameRondMax", window.gameRoundMax);
    console.log("gameRond", window.gameRound);
    // if (window.shuflledNickList.lenght === 1)
    // {
    //     window.loadScript("gameMenu/gameMenuScript.js");
    //     console.log("END OF TORUNAMENT");
    // }
    if (!window.shuflledNickList[window.gamesPerRound])
    {
        window.gamesPerRound = 0;
        window.gameRound++;
    }
    window.nextMatch.player1 = window.shuflledNickList[window.gamesPerRound];
    window.nextMatch.player2 = window.shuflledNickList[window.gamesPerRound + 1];
    window.gamesPerRound++;
    
    console.log(window.shuflledNickList);
    // console.log(window.shuflledNickList[window.gamesPerRound]);
    // console.log(window.nextMatch.player1);
    // console.log(window.nextMatch.player2);

}

function loadScript(filePath)
{
    // let existingGameScript = document.getElementById("gameS");

    // if (existingGameScript)
    //     existingGameScript.parentNode.removeChild(existingGameScript);

    window.removeScripts();

    const script = document.createElement('script');
    script.src = filePath;
    script.type = 'text/javascript';

    script.onload = function() {
        if (typeof init === 'function') {
            init();
        } else {
            console.error("init function not found" + filePath);
        }
    };

    document.body.appendChild(script);
}

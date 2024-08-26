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

function loadScriptGlobal(filePath)
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

function resetMenu()
{
    document.getElementById('menuPage').classList.add('hidden');
    document.getElementById('menuButtons').classList.remove('hidden');
    document.getElementById('tournamentButton').classList.add('hidden');
}

function resetTournament()
{
    const nForm = document.getElementById('nForm');

    if (nForm) {
        // The div exists, so remove it
        nForm.remove();
    }

    // const gameBracketDiv = document.getElementById('gameBracketDiv');

    // if (gameBracketDiv) {
    //     // The div exists, so remove it
    //     gameBracketDiv.remove();
    // }
}

function menu_hashchange()
{
    window.removeEventListener("hashchange", menu_hashchange);
    // if (window.location.hash !== '#menu')
    // {
    resetMenu();
    resetTournament();
    UnloadScripts(window.menuScript);
    console.log("menu reset hash!");

    // }
    // UnloadScripts(window.tournamentScripts);
}
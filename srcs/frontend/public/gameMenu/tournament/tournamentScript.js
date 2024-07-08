function init() {
 
    let shuflledNickList = [];

    shuflledNickList = shuffleNickNames();
    
    createPageElements(shuflledNickList);


}

function createPageElements(shuflledNickList)
{
    // Create Div for Bracket
    const gameBracketDiv = document.createElement('div');
    gameBracketDiv.id = 'gameBracket';

    gameBracketDiv.innerHTML = '<h1 id="textBracket" class="selectText">Tournament Bracket</h1>'
    
    document.body.appendChild(gameBracketDiv);

    createBracket(shuflledNickList);

    const startGameBtn = document.createElement('button');
    startGameBtn.id = 'startGameBtn';
    startGameBtn.textContent = 'Next Game';
    startGameBtn.classList.add('button', 'red-button');

    gameBracketDiv.appendChild(startGameBtn);

    startGameBtn.addEventListener('click', (event) => {
        event.preventDefault();
        gameBracketDiv.classList.add('hidden');
        loadScript("../game/gameScript.js")
    });

}


function createBracket(players) {
    const bracket = document.createElement('div');
    bracket.id = 'bracket';
    bracket.classList.add('bracket');
    bracket.innerHTML = ''; // Clear any existing bracket

    let rounds = Math.ceil(Math.log2(players.length));
    let totalDivs = ((rounds - 1) * 2) + 1;
    let middleDiv = Math.floor((totalDivs + 1) / 2);
    let firstRoundMatches = (players.length / 2) / 2;
    let matchDivider = 1;

    console.log(players);
    console.log(players.length);

    for (let i = 0; i < middleDiv - 1; i++) {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';
        bracket.appendChild(roundDiv);

        let roundMatches = firstRoundMatches / matchDivider;
        
        for (let j = 0; j < roundMatches; j++) {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            if (i === 0) {
            // Initial round
            matchDiv.innerHTML = `<span>${players[j * 2]}</span><span>vs</span><span>${players[j * 2 + 1]}</span>`;
            } else {
                matchDiv.innerHTML = `<span>SEMI FINALS</span>`;
            }
            roundDiv.appendChild(matchDiv);
        }
        matchDivider = 2;
    }

    const finalRoundDiv = document.createElement('div');
    finalRoundDiv.className = 'round';
    bracket.appendChild(finalRoundDiv);
    const matchDiv = document.createElement('div');
    matchDiv.className = 'match';
    matchDiv.innerHTML = `<span>FINAL</span>`;
    finalRoundDiv.appendChild(matchDiv);

    for (let i = totalDivs; i > middleDiv; i--) {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';
        bracket.appendChild(roundDiv);

        let roundMatches = firstRoundMatches / matchDivider;
        console.log(totalDivs - 1);
        console.log(i);
        for (let j = 0; j < roundMatches; j++) {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match';
            if (i - 1 === middleDiv) {
                // Initial round
                matchDiv.innerHTML = `<span>${players[(players.length / 2) + (j * 2)]}</span><span>vs</span><span>${players[(players.length / 2) + (j * 2) + 1]}</span>`;
            } else {
                matchDiv.innerHTML = `<span>SEMI FINALS</span>`;
            }
            roundDiv.appendChild(matchDiv);
        }
        if (i - 2 === middleDiv)
            matchDivider = 1;
    }

    const gameBracketDiv = document.getElementById('gameBracket');
    gameBracketDiv.appendChild(bracket);
}


function shuffleNickNames()
{
    for (let index = 0; index < window.nickList.length; index++)
    {
        let randomPos = Math.floor(Math.random() * window.nickList.length);
        [window.nickList[index], window.nickList[randomPos]] = [window.nickList[randomPos], window.nickList[index]];
    }

    return window.nickList;
}

function loadScript(filePath)
{
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

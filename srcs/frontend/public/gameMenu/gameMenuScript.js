function init() {
    nickList = [];

    // Create Game Page Background Div - This will be the div for the entire page. Always visible. All elements in the page will be inside it.
    const gamePageBgDiv = document.createElement('div');
    gamePageBgDiv.id = "gamePageBg";

    // Append Game Page Backgroud to Body
    document.body.appendChild(gamePageBgDiv);

    // Create Div for Menu
    const gameMenuDiv = document.createElement('div');
    gameMenuDiv.id = 'gameMenu';
    
    // Create elements inside gameMenuDiv
    gameMenuDiv.innerHTML = '<h1 id=selectText>Select Game Mode</h1>' +
                            '<button id="normalGameBtn" class="button red-button">Normal Game</button>' +
                            '<button id="tournamentGameBtn" class="button blue-button">Tournament Game</button>'

    // Append Menu Div to Page Div
    gamePageBgDiv.appendChild(gameMenuDiv);
    
    // // Create Select Game Text
    // const selectTextHeader = document.createElement('h1');
    // selectTextHeader.id = 'selectText';
    // selectTextHeader.textContent = 'Select Game Mode';

    // // Create Button for Normal Game
    // const normalGameButton = document.createElement('button');
    // normalGameButton.id = 'normalGameBtn';
    // normalGameButton.textContent = 'Normal Game';
    // normalGameButton.classList.add('button', 'red-button');
    
    // // Create Button for Tournament Game
    // const tournamentGameButton = document.createElement('button');
    // tournamentGameButton.id = 'tournamentGameBtn';
    // tournamentGameButton.textContent = 'Tournament Game';
    // tournamentGameButton.classList.add('button', 'blue-button');    
    
    // // Append Buttons and Text to Menu Div
    // gameMenuDiv.appendChild(selectTextHeader);
    // gameMenuDiv.appendChild(document.createElement('br'));
    // gameMenuDiv.appendChild(normalGameButton);
    // gameMenuDiv.appendChild(tournamentGameButton);

    // Create Game Canvas
    const gameAreaCanvas = document.createElement('canvas');
    gameAreaCanvas.id = 'gameArea';
    gameAreaCanvas.classList.add('hidden');

    // Append Canvas to Game Page Background
    gamePageBgDiv.appendChild(gameAreaCanvas);
    

    // Listen to Normal Game Button
    const gameButton = document.getElementById("normalGameBtn");
    gameButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Hide Game Menu Div
        document.getElementById('gameMenu').classList.add('hidden');

        // Call getNicknames() and stores them in nickList
        // A callback is used to make the nicknames are saved before game starts
        // How callback works:
        // When calling a function, pass another function as parameter
        // Ate the end of the function called, call the function passed as parameter
        // This will ensure everything in the func passed as parameter executes after the func called
        // In this case 'gameArea' is hidden and gameScript.js is loaded only after getNicknames execute
        nickList = getNicknames(2, function(updatedNickList) {
            nickList = updatedNickList;
            document.getElementById('gameArea').classList.remove('hidden');
            loadScript("gameMenu/game/gameScript.js");
        });
    });

    // const tournamentButton = document.getElementById("tournament-button");
    // tournamentButton.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     // document.getElementById('Title').classList.add('hidden');
    //     document.getElementById('game-menu').classList.add('hidden');
    //     document.getElementById('tournament-menu').classList.remove('hidden');

        // nickList = tournamentMenu(0);
    // });
}


function tournamentMenu(size) {
    nickList = [];

    if (size === 2)
    {
        nickList = getTournamentNicknames(2);
        return nickList;
    }

    document.getElementById("4p").addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('tournament-menu').classList.add('hidden');
        document.getElementById('4pform').classList.remove('hidden');

        nickList = getTournamentNicknames(4);
        console.log(nickList);
    });

    document.getElementById("8p").addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('tournament-menu').classList.add('hidden');
        document.getElementById('8pform').classList.remove('hidden');

        nickList = getTournamentNicknames(8);
        console.log(nickList);
    });

}

function getNicknames(size, callback)
{
    const nickList = [];
    const nicksForm = document.createElement('div');
    nicksForm.id = 'nForm';

    document.body.appendChild(nicksForm);

    for (let i = 0; i < size; i++)
    {
        const boxLabel = document.createElement('label');
        boxLabel.id = 'bLabel';
        boxLabel.textContent = 'Player' + (i + 1);

        const inputBox = document.createElement('input');
        inputBox.id = 'nickBox' + i;
        inputBox.type = 'text';

        nicksForm.appendChild(boxLabel);
        nicksForm.appendChild(inputBox);
        nicksForm.appendChild(document.createElement('br'));

    }

    const okButton = document.createElement('button');
    okButton.textContent = "Save";
    okButton.id = 'acceptNick';

    nicksForm.appendChild(okButton);

    okButton.addEventListener('click', function() {
        for (let i = 0; i < size; i++)
        {
            const nick = document.getElementById('nickBox' + i).value;
            nickList.push(nick);
        }
        document.body.removeChild(nicksForm);

        callback(nickList);
    });
    return nickList;
}


// Starts scripts (Script has to start with init() function)
function loadScript(filePath)
{
    const script = document.createElement('script');
    script.src = filePath;
    script.type = 'text/javascript';

    script.onload = function() {
        if (typeof init === 'function') {
            init();
        } else {
            console.error("init function not found: " + filePath);
        }
    };

    document.body.appendChild(script);
}
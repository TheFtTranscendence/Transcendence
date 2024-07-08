function init() {
    let nickList = [];    

    createPageElements();

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
            window.nickList = nickList;
            loadScript("gameMenu/game/gameScript.js");
        });
    });

    // Listen to tournament button
    const tournamentButton = document.getElementById("tournamentGameBtn");
    tournamentButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Hide Game Menu Div
        document.getElementById('gameMenu').classList.add('hidden');

        document.getElementById('tournamentType').classList.remove('hidden');

        // 4P Button
        document.getElementById("4p").addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('tournamentType').classList.add('hidden');
            document.getElementById('gamePageBg').classList.add('hidden');
            
            nickList = getNicknames(4, function(updatedNickList) {
                nickList = updatedNickList;
                window.nickList = nickList;
                loadScript("gameMenu/tournament/tournamentScript.js");
                // console.log(nickList);
            });
        });
    
        // 8P Button
        document.getElementById("8p").addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('tournamentType').classList.add('hidden');
            document.getElementById('gamePageBg').classList.add('hidden');
    
            nickList = getNicknames(8, function(updatedNickList) {
                nickList = updatedNickList;
                window.nickList = nickList;
                loadScript("gameMenu/tournament/tournamentScript.js");
                // console.log(nickList);
            });
        });
    });
}

function createPageElements()
{
    // Create Game Page Background Div - This will be the div for the entire page. Always visible. All elements in the page will be inside it.
    const gamePageBgDiv = document.createElement('div');
    gamePageBgDiv.id = "gamePageBg";

    // Append Game Page Backgroud to Body
    document.body.appendChild(gamePageBgDiv);

    // Create Div for Menu
    const gameMenuDiv = document.createElement('div');
    gameMenuDiv.id = 'gameMenu';
    
    // Create elements inside gameMenuDiv
    gameMenuDiv.innerHTML = '<h1 id="gameMode" class="selectText">Select Game Mode</h1>' +
                            '<button id="normalGameBtn" class="button red-button">Normal Game</button>' +
                            '<button id="tournamentGameBtn" class="button blue-button">Tournament Game</button>'

    // Create Game Canvas
    const gameAreaCanvas = document.createElement('canvas');
    gameAreaCanvas.id = 'gameArea';
    gameAreaCanvas.classList.add('hidden');

    // Created Div for tournament Type
    const tournamentTypeDiv = document.createElement("div");
    tournamentTypeDiv.id = "tournamentType";
    tournamentTypeDiv.classList.add('hidden');
    tournamentTypeDiv.innerHTML = '<h1 id="tModeText" class="SelectText">Select Tournament Mode</h1>' +
                        '<button id="4p" class="button red-button">4 Players</button>' +
                        '<button id="8p" class="button blue-button">8 Players</button>'

    // Append Elements to Main Page Div
    gamePageBgDiv.appendChild(gameMenuDiv);
    gamePageBgDiv.appendChild(gameAreaCanvas);
    gamePageBgDiv.appendChild(tournamentTypeDiv);
    
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
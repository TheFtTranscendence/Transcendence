
function init() {
    let nickList = [];    

    window.restoreGameCanvas();

    if (window.menuCreated)
    {
        document.getElementById("menuPage").classList.remove('hidden')
        document.getElementById("menuButtons").classList.remove('hidden')
    }
    else
        createPageElements();

    // Listen to Normal Game Button
    const gameButton = document.getElementById("normalGameBtn");
    gameButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Hide Menu Div
        document.getElementById('menuButtons').classList.add('hidden');

        // Call getNicknames() and stores them in nickList
        // A callback is used to make the nicknames are saved before game starts
        // How callback works:
        // When calling a function, pass another function as parameter
        // Ate the end of the function called, call the function passed as parameter
        // This will ensure everything in the func passed as parameter executes after the func called
        // In this case 'gameArea' is hidden and gameScript.js is loaded only after getNicknames execute
        nickList = getNicknames(2, function(updatedNickList) {
            nickList = updatedNickList;
            document.getElementById("gameArea").classList.remove('hidden');
            window.nickList = nickList;
            loadScript("gameMenu/game/gameScript.js");
        });
    });

    // Listen to tournament button
    const tournamentButton = document.getElementById("tournamentGameBtn");
    tournamentButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Hide Game Menu Div
        document.getElementById('menuButtons').classList.add('hidden');

        document.getElementById('tournamentButton').classList.remove('hidden');

        // 4P Button
        document.getElementById("4p").addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('tournamentButton').classList.add('hidden');
            
            nickList = getNicknames(4, function(updatedNickList) {
                nickList = updatedNickList;
                window.nickList = nickList;
                window.gameRoundMax = 2;
                loadScript("gameMenu/tournament/tournamentScript.js");
                // console.log(nickList);
            });
        });
    
        // 8P Button
        document.getElementById("8p").addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('tournamentButton').classList.add('hidden');
    
            nickList = getNicknames(8, function(updatedNickList) {
                nickList = updatedNickList;
                window.nickList = nickList;
                window.gameRoundMax = 3;
                loadScript("gameMenu/tournament/tournamentScript.js");
                // console.log(nickList);
            });
        });
    });
    
}

function createPageElements()
{
    // Create Menu Page Div - This will be the div for the entire page. Always visible. All elements in the page will be inside it.
    const menuPageDiv = document.createElement('div');
    menuPageDiv.id = "menuPage";

    // Append Menu Page to Body
    document.body.appendChild(menuPageDiv);

    // Create Div for Menu Buttons
    const menuButtonsDiv = document.createElement('div');
    menuButtonsDiv.id = 'menuButtons';
    
    // Create elements inside menuButtonsDiv
    menuButtonsDiv.innerHTML = '<h1 id="gameMode" class="selectText">Select Game Mode</h1>' +
                            '<button id="normalGameBtn" class="button red-button">Normal Game</button>' +
                            '<button id="tournamentGameBtn" class="button blue-button">Tournament Game</button>'

    // Created Div for tournament Type
    const tournamentButtonDiv = document.createElement("div");
    tournamentButtonDiv.id = "tournamentButton";
    tournamentButtonDiv.classList.add('hidden');
    tournamentButtonDiv.innerHTML = '<h1 id="tModeText" class="SelectText">Select Tournament Mode</h1>' +
                        '<button id="4p" class="button red-button">4 Players</button>' +
                        '<button id="8p" class="button blue-button">8 Players</button>'

    // Create Game Canvas
    const gameAreaCanvas = document.createElement('canvas');
    gameAreaCanvas.id = 'gameArea';
    gameAreaCanvas.classList.add('hidden');


    // Append Elements to Main Page Div
    menuPageDiv.appendChild(menuButtonsDiv);
    menuPageDiv.appendChild(tournamentButtonDiv);
    menuPageDiv.appendChild(gameAreaCanvas);
    
    window.menuCreated = true;
}

function getNicknames(size, callback)
{
    const nickList = [];
    const menuPageDiv = document.getElementById("menuPage");
    let nicksForm = document.getElementById("nForm");

    if (!nicksForm)
    {
        nicksForm = document.createElement('div');
        nicksForm.id = 'nForm';
        menuPageDiv.appendChild(nicksForm);
    }
    else
    {
        nicksForm.innerHTML = '';
    }

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
        nicksForm.classList.add('hidden');
        menuPageDiv.removeChild(nicksForm);

        callback(nickList);
    });
    return nickList;
}


// Starts scripts (Script has to start with init() function)
function loadScript(filePath)
{
    // let existingGameScript = document.getElementById("gameS");

    // if (existingGameScript)
    //     existingGameScript.parentNode.removeChild(existingGameScript);

    window.removeScripts();


    const gameScript = document.createElement('script');
    gameScript.id = 'gameS';
    gameScript.src = filePath;
    gameScript.type = 'text/javascript';

    gameScript.onload = function() {
        if (typeof init === 'function') {
            init();
        } else {
            console.error("init function not found: " + filePath);
        }
    };

    document.body.appendChild(gameScript);
}

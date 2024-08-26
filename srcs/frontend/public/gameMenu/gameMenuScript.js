
function startMenu() {
    let nickList = [];    

    window.addEventListener("hashchange", menu_hashchange);

    // window.restoreGameCanvas();

    // if (window.menuCreated)
    // {
    //     document.getElementById("menuPage").classList.remove('hidden')
    //     document.getElementById("menuButtons").classList.remove('hidden')
    // }
    // else
    //     createPageElements();


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
            // document.getElementById("game").classList.remove('hidden');
            window.nickList = nickList;
            loadScripts('game', window.gameScripts, 'startGame');
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
                loadScripts('', window.tournamentScript, 'startTournament');
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
                loadScripts('', window.tournamentScript, 'startTournament');
                // console.log(nickList);
            });
        });
    });
    
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

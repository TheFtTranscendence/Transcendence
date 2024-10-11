function clearTournament() {
    document.getElementById('tournament-area').classList.add("hidden");

    // Make sure you're removing the exact listener added previously
    window.removeEventListener('hashchange', clearTournament); 

    if (window.nextGameButton) {
        window.nextGameButton.removeEventListener('click', next_game);
    }

    unloadScripts(window.tournamentScripts);
}
// function tournament_hashchange()
// {
//     clearTournament()
// 	unloadScripts(window.tournamentScripts)
// }

async function next_game_players() {
    let nextGamePlayers = [];

    if (window.location.hash == '#fighters') {
        const url = `https://${window.IP}:3000/solidity/solidity/getnexttournamentplayers/${window.user.blockchain_id}/Fighty`;

        // Move the fetch logic here and use await to wait for the data
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data = await response.json(); // Wait for the response to be parsed as JSON
            console.log('Tournament players:', data);
            nextGamePlayers = data.success;  // Now this will contain the fetched data
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        const url = `https://${window.IP}:3000/solidity/solidity/getnexttournamentplayers/${window.user.blockchain_id}/Pongy`;

        // Same approach here, await the fetch
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data = await response.json(); // Wait for the response to be parsed as JSON
            console.log('Tournament players:', data);
            nextGamePlayers = data.success;  // Now this will contain the fetched data
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Now log after the players are fetched and the array is populated
    console.log("PLAYER1 -> ", nextGamePlayers[0]);
    console.log("PLAYER2 -> ", nextGamePlayers[1]);

    let names = [];
    let skins = [];

    nextGamePlayers.forEach(item => {
        let name = item.slice(0, -1);
        let skin = parseInt(item.slice(-1));

        names.push(name);
        skins.push(skin);
    });

    return [names, skins];
}

async function next_game() {
    document.getElementById('tournament-area').classList.add("hidden");
    window.tournamentVars.tournamentMatch = true;

    let playerNames = [];
    let playerSkins = [];

    [playerNames, playerSkins] = await next_game_players();

    if (window.location.hash == '#fighters') {
        document.getElementById('div-game2-area').classList.remove("hidden");
        window.player1Skin = 0;
        window.player2Skin = 1;
        unloadScripts(window.menuScripts);
        clearTournament();
        startGame2(playerNames[0], playerNames[1], window.game2Skins[playerSkins[0]], window.game2Skins[playerSkins[1]], true);
    } else {
        document.getElementById('game-area').classList.remove("hidden");

        clearTournament();

        // let p1 = window.playerCounter;
        // console.log("p1 -> ", p1);
        startGame(playerNames[0], playerNames[1], window.game1Skins[playerSkins[0]], window.game1Skins[playerSkins[1]], playerSkins[0], playerSkins[1], true, false);
        // window.playerCounter += 2;
    }
}

async function getTournamentPlayers() {
    let players = []; // Default value
    
    try {
        let url;
        // Check the hash in the URL and choose the correct API endpoint
        if (window.location.hash == '#fighters') {
            url = `https://${window.IP}:3000/solidity/solidity/getcurrenttournamentplayerslist/${window.user.blockchain_id}/Fighty`;
        } else {
            url = `https://${window.IP}:3000/solidity/solidity/getcurrenttournamentplayerslist/${window.user.blockchain_id}/Pongy`;
        }
        
        // Use await to wait for the fetch request to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Store the status from the response
        players = data.success;

        console.log('Current Tournament Players:', players); // Log the gameStatus
        
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
    }

    // Return the gameStatus after the fetch request completes
    return players;
}

async function getTournamentRankings() {
    let tournamentRakings = {}; // Default value
    
    try {
        let url;
        // Check the hash in the URL and choose the correct API endpoint
        if (window.location.hash == '#fighters') {
            url = `https://${window.IP}:3000/solidity/solidity/getlasttournamentranking/${window.user.blockchain_id}/Fighty`;
        } else {
            url = `https://${window.IP}:3000/solidity/solidity/getlasttournamentranking/${window.user.blockchain_id}/Pongy`;
        }
        
        // Use await to wait for the fetch request to complete
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Store the status from the response
        tournamentRakings = data.success;

        console.log('Current tournamentRakings:', tournamentRakings); // Log the gameStatus
        
    } catch (error) {
        // Handle any errors
        console.error('Error:', error);
    }

    // Return the gameStatus after the fetch request completes
    return tournamentRakings;
}

async function show_bracket()
{
	const players = await getTournamentPlayers();
	if (players.length === 4)
	{
		const elements = document.querySelectorAll('.four-players');
		elements.forEach((element, index) => {
			element.classList.remove('hidden')
		})
	}
	else
	{
		const elements = document.querySelectorAll('.eight-players');
		elements.forEach((element, index) => {
			element.classList.remove('hidden')
		})
	}

	// roundOnePlayers = "";
    for (i = 0; i < players.length; i++)
    {
        input_id = 'player' + (i + 1) + '-r1';
        document.getElementById(input_id).textContent = players[i];
    }

	const tournamentRakings = await getTournamentRankings();

	console.log("tournament rakings!!! -> ", tournamentRakings)
	

}

function shuffle_names(playerNames, playerSkins)
{
    for (let index = 0; index < playerNames.length; index++)
    {
        let randomPos = Math.floor(Math.random() * playerNames.length);
        [playerNames[index], playerNames[randomPos]] = [playerNames[randomPos], playerNames[index]];
        [playerSkins[index], playerSkins[randomPos]] = [playerSkins[randomPos], playerSkins[index]];
    }

    return [playerNames, playerSkins];
}

function unloadScriptIfLoaded(scriptPath) {
    const scripts = document.getElementsByTagName('script');
    
    // Check if the script is already loaded
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes(scriptPath)) {
            // Script is loaded, now remove it
            scripts[i].parentNode.removeChild(scripts[i]);
            console.log(`Script with path ${scriptPath} has been unloaded.`);
            return;  // Exit after unloading the script
        }
    }

    console.log(`Script with path ${scriptPath} is not loaded.`);
}


function tournament_loop() {
    // Make sure you clear the hashchange listener first
    window.removeEventListener('hashchange', clearTournament);
    
    window.addEventListener('hashchange', clearTournament);

    document.getElementById('tournament-area').classList.remove("hidden");

    if (window.location.hash == '#fighters') {
        document.getElementById('div-game2-area').classList.add("hidden");
        // show_bracket(window.playerNames);
    } else {
        document.getElementById('game-area').classList.add("hidden");
        unloadScriptIfLoaded(window.gameScripts);
    }

	show_bracket();
	
    // Make sure you are not registering multiple listeners
    if (window.nextGameButton) {
        window.nextGameButton.removeEventListener('click', next_game);
    }

    window.nextGameButton = document.getElementById('next-game-button');
    window.nextGameButton.addEventListener('click', next_game);

    if (window.location.hash == '#fighters') {
        loadScripts(window.game2Scripts);
    } else {
        loadScripts(window.gameScripts);
    }

    // console.log(window.pongPlayerNames);
    // console.log(window.pongPlayerSkins);

}

async function storeTournament(namesAndSkins) {
    const data = {
        players: namesAndSkins
    };

    let url;
    if (window.location.hash == '#fighters') {
        url = `https://${window.IP}:3000/solidity/solidity/addtournament/${window.user.blockchain_id}/Fighty`;
    } else {
        url = `https://${window.IP}:3000/solidity/solidity/addtournament/${window.user.blockchain_id}/Pongy`;
    }

    console.log("Storing tournament:", JSON.stringify(data));

    // Use fetch to store the tournament and wait for the response
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    // Check if the response is okay
    if (!response.ok) {
        throw new Error(`Failed to store tournament: ${response.statusText}`);
    }

    return response.json(); // Assuming the response is in JSON format
}

async function start_tournament(playerNamesOrd, playerSkinsOrd) {
    document.getElementById('games-tournament-menu').classList.add("hidden");

    [window.playerNames, window.playerSkins] = shuffle_names(playerNamesOrd, playerSkinsOrd);
    const namesAndSkins = window.playerNames.map((name, skin) => name + window.playerSkins[skin]);

    const gameStatus = await window.getTournamentStatus();
    console.log(gameStatus);

    // Store tournament data and wait for the result
    if (!gameStatus) {
        await storeTournament(namesAndSkins);  // Wait for the tournament to be stored
    }

    // Now the tournament is stored, proceed with the tournament loop
    tournament_loop();
}

// async function getTournamentStatus() {
//     let gameStatus = false; // Default value
    
//     try {
//         let url;
//         // Check the hash in the URL and choose the correct API endpoint
//         if (window.location.hash == '#fighters') {
//             url = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Fighty`;
//         } else {
//             url = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Pongy`;
//         }
        
//         // Use await to wait for the fetch request to complete
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         // Check if the response is okay
//         if (!response.ok) {
//             throw new Error(`Error fetching data: ${response.statusText}`);
//         }

//         // Parse the response JSON
//         const data = await response.json();
        
//         // Store the status from the response
//         gameStatus = data.success;

//         console.log('gameStatus:', gameStatus); // Log the gameStatus
        
//     } catch (error) {
//         // Handle any errors
//         console.error('Error:', error);
//     }

//     // Return the gameStatus after the fetch request completes
//     return gameStatus;
// }

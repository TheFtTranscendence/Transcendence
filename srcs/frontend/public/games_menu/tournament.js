function clearTournament() {
    document.getElementById('tournament-area').classList.add("hidden");

    // Make sure you're removing the exact listener added previously
    window.removeEventListener('hashchange', clearTournament); 

    if (window.nextGameButton) {
        window.nextGameButton.removeEventListener('click', next_game);
    }

    UnloadScripts(window.tournamentScripts);
}
// function tournament_hashchange()
// {
//     clearTournament()
// 	UnloadScripts(window.tournamentScripts)
// }

async function next_game_players()
{
	let nextGamePlayers = [];
    try{
        const response = await axios.get('http://localhost:8001/solidity/getnexttournamentplayers/' + window.user.blockchain_id + "/Pongy");
        console.log("HEREEE1!!!");
        console.log(response.data);
        nextGamePlayers = response.data.success;
    }
	catch (error) {
		console.error(error);
		if (error.response)	{
			const status = error.response.status;
		}
	}

    console.log("PLAYER1 -> ", nextGamePlayers[0]);
    
    console.log("PLAYER2 -> ", nextGamePlayers[1]);

    let names = [];
    let skins = [];

    nextGamePlayers.forEach(item => {
        let name = item.slice(0, -1);
        let skin = parseInt(item.slice(-1));

        names.push(name);
        skins.push(skin);
    })
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
        UnloadScripts(window.menuScripts);
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

function show_bracket(playerNames)
{
	if (playerNames.length === 4)
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

	roundOnePlayers = "";
    for (i = 0; i < playerNames.length; i++)
    {
        input_id = 'player' + (i + 1) + '-r1';
        document.getElementById(input_id).textContent = playerNames[i];
    }

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


function tournament_loop() {
    // Make sure you clear the hashchange listener first
    window.removeEventListener('hashchange', clearTournament);
    
    window.addEventListener('hashchange', clearTournament);

    document.getElementById('tournament-area').classList.remove("hidden");

    if (window.location.hash == '#fighters') {
        document.getElementById('div-game2-area').classList.add("hidden");
        show_bracket(window.playerNames);
    } else {
        document.getElementById('game-area').classList.add("hidden");
        show_bracket(window.pongPlayerNames);
    }

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

function storeTournament(namesAndSkins)
{
    if (window.location.hash == '#fighters') {
        axios.post('http://localhost:8001/solidity/addtournament/' +  window.user.blockchain_id + "/Fighty", {
            players: namesAndSkins,
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
            if (error.response)	{
                const status = error.response.status;
            }
        });
    }
    else {
        axios.post('http://localhost:8001/solidity/addtournament/' +  window.user.blockchain_id + "/Pongy", {
            players: namesAndSkins,
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
            if (error.response)	{
                const status = error.response.status;
            }
        });  
    }
}

function start_tournament(playerNamesOrd, playerSkinsOrd) {
    document.getElementById('games-tournament-menu').classList.add("hidden");

    if (window.location.hash == '#fighters')
        window.fightyTournamentOn = true;
    else
        window.pongyTournamentOn = true;

    // if (window.location.hash == '#fighters') {
    //     [window.playerNames, window.playerSkins] = shuffle_names(playerNamesOrd, playerSkinsOrd);
    //     tournament_loop();
    // } else {
    //     [window.pongPlayerNames, window.pongPlayerSkins] = shuffle_names(playerNamesOrd, playerSkinsOrd);
    //     tournament_loop();
    // }
    [window.playerNames, window.playerSkins] = shuffle_names(playerNamesOrd, playerSkinsOrd);
    const namesAndSkins = window.playerNames.map((name, skin) => name + window.playerSkins[skin]);


    axios.get('http://localhost:8001/solidity/getlasttournamentranking/' + window.user.blockchain_id + "/Pongy")
	.then((response) => {
        console.log("BLOCKCHAIN TOURNEY");
		console.log(response.data);
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			const status = error.response.status;
		}
	});

    // console.log("namesAndSkins\n", namesAndSkins);

    storeTournament(namesAndSkins);

    tournament_loop();
}
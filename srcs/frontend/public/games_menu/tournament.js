function clearTournament() {


    // Make sure you're removing the exact listener added previously
    window.removeEventListener('hashchange', clearTournament); 

    document.getElementById('next-game-button').removeEventListener('click', next_game)
    
    if (window.location.hash == '#fighters') {
        if (fightyTournamentData.matchCounter !== 0 && fightyTournamentData.nrMatches === fightyTournamentData.matchCounter)
        {
            clearBracket()
            fightyTournamentData.resetTournament()
            pongyTournamentData.resetTournament()
        
            document.getElementById('leave-tournament-button').removeEventListener('click', leaveTournament)
            const winnerScreen = document.getElementById('winner-screen');
            winnerScreen.classList.add("hidden"); 
            winnerScreen.textContent = ''; 
            document.getElementById("winner-message").textContent = ""
        
        
            loadScripts(window.menuScripts)
            main_menu()
        }
    }
    else {
        if (pongyTournamentData.matchCounter !== 0 && pongyTournamentData.nrMatches === pongyTournamentData.matchCounter)
        {
            clearBracket()
            pongyTournamentData.resetTournament()
            console.dir(pongyTournamentData)
                
            document.getElementById('leave-tournament-button').removeEventListener('click', leaveTournament)
            document.getElementById("winner-message").textContent = ""
        
        }
    }
    document.getElementById("first-match-r3").classList.add("hidden"); 
    document.getElementById('winner-screen').classList.add("hidden");
    document.getElementById('tournament-area').classList.add("hidden");

    unloadScripts(window.tournamentScripts);
}

function next_game_players() {
    let nextGamePlayers = [];

    if (window.location.hash == '#fighters') {
        nextGamePlayers = fightyTournamentData.getNextTournamentMatch()
    }
    else {
        nextGamePlayers = pongyTournamentData.getNextTournamentMatch()
    }

    // Now log after the players are fetched and the array is populated

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

function next_game() {
    document.getElementById('next-game-button').removeEventListener('click', next_game)
    document.getElementById('tournament-area').classList.add("hidden");
    document.getElementById('tournament-bracket').classList.add("hidden");
    document.getElementById('winner-screen').classList.add("hidden");
    window.tournamentVars.tournamentMatch = true;

    let playerNames = [];
    let playerSkins = [];

    [playerNames, playerSkins] = next_game_players();

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

        startGame(playerNames[0], playerNames[1], window.game1Skins[playerSkins[0]], window.game1Skins[playerSkins[1]], playerSkins[0], playerSkins[1], true, false);
    }
}

function clearBracket()
{
    document.getElementById('final').classList.remove('hidden')

    let roundInfo = {}
    let tournamentSize = 0
 
    if (window.location.hash == '#fighters') {
        roundInfo = fightyTournamentData.getRoundInfo()
        tournamentSize = fightyTournamentData.nrPlayers
    }
    else {
        roundInfo = pongyTournamentData.getRoundInfo()
        tournamentSize = pongyTournamentData.nrPlayers
    }

    // show divs
	if (tournamentSize === 4)
    {
        const elements = document.querySelectorAll('.four-players');
        elements.forEach((element, index) => {
            element.classList.add('hidden')
        })
    }
    else
    {
        const elements = document.querySelectorAll('.eight-players');
        elements.forEach((element, index) => {
            element.classList.add('hidden')
        })
    }

    if (roundInfo.nrRounds === 2)
    {
        document.getElementById('final').classList.remove('hidden')
    }

	let lastValue = 0
    let divId = 1

    // clear round one
    for (i = 0; i < roundInfo.roundOneMatches * 2; i++)
    {
        input_id = 'player' + (divId) + '-r1';
        document.getElementById(input_id).textContent = "";
        divId++
    }
    lastValue += roundInfo.roundOneMatches * 2

    divId = 1

    // clear round two
    for (i = roundInfo.roundOneMatches * 2; i < (roundInfo.roundTwoMatches * 2) + lastValue; i++)
    {
        input_id = 'player' + (divId) + '-r2';
        document.getElementById(input_id).textContent = "";
        divId++
    }

    lastValue += roundInfo.roundTwoMatches * 2
    divId = 1

    if (roundInfo.nrRounds === 3) {
        // clear round three
        for (i = roundInfo.roundTwoMatches * 2; i < (roundInfo.roundThreeMatches * 2) + lastValue; i++)
        {
            input_id = 'player' + (divId) + '-r3';
            if (i < players.length)
                document.getElementById(input_id).textContent = "";
            divId++
        }
    }
}

function leaveTournament()
{
	console.log("heree clear tournament")

    // Make sure you're removing the exact listener added previously
    window.removeEventListener('hashchange', clearTournament); 

    document.getElementById('next-game-button').removeEventListener('click', next_game)

	clearBracket()
    if (window.location.hash == '#fighters') {
        fightyTournamentData.resetTournament()
    }
    else {
        pongyTournamentData.resetTournament()
    }

    document.getElementById('leave-tournament-button').removeEventListener('click', leaveTournament)
    document.getElementById("winner-message").textContent = ""

    document.getElementById("first-match-r3").classList.add("hidden"); 
    document.getElementById('winner-screen').classList.add("hidden");
    document.getElementById('tournament-area').classList.add("hidden");

    unloadScripts(window.tournamentScripts);
    loadScripts(window.menuScripts)
    main_menu()
}

async function show_bracket()
{
    document.getElementById('tournament-bracket').classList.remove("hidden");

    let players = []
    let nextMatch = []
    let roundInfo = {}
    let tournamentSize = 0
 
    if (window.location.hash == '#fighters') {
        players = fightyTournamentData.getBracketPlayerList()
        nextMatch = fightyTournamentData.getNextTournamentMatch()
        roundInfo = fightyTournamentData.getRoundInfo()
        tournamentSize = fightyTournamentData.nrPlayers
    }
    else {
        players = pongyTournamentData.getBracketPlayerList()
        nextMatch = pongyTournamentData.getNextTournamentMatch()
        roundInfo = pongyTournamentData.getRoundInfo()
        tournamentSize = pongyTournamentData.nrPlayers
    }

    players = players.map(str => str.slice(0, -1));

    // show divs
	if (tournamentSize === 4)
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

    if (roundInfo.nrRounds === 2)
    {
        document.getElementById('third-match-r1').classList.add('hidden')
        document.getElementById('fourth-match-r1').classList.add('hidden')
        document.getElementById('final').classList.add('hidden')
    }


    let lastValue = 0
    let divId = 1

    // Print round one
    for (i = 0; i < roundInfo.roundOneMatches * 2; i++)
    {
        input_id = 'player' + (divId) + '-r1';
        document.getElementById(input_id).textContent = players[i];
        divId++
    }
    lastValue += roundInfo.roundOneMatches * 2

    divId = 1

    // Print round two
    for (i = roundInfo.roundOneMatches * 2; i < (roundInfo.roundTwoMatches * 2) + lastValue; i++)
    {
        input_id = 'player' + (divId) + '-r2';
        document.getElementById(input_id).textContent = players[i];
        divId++
    }

    lastValue += roundInfo.roundTwoMatches * 2
    divId = 1

    if (roundInfo.nrRounds === 3) {
        // Print round three
        document.getElementById("first-match-r3").classList.remove("hidden"); 
        for (i = (roundInfo.roundTwoMatches * 2) + lastValue; i < (roundInfo.roundThreeMatches * 2) + lastValue; i++)
        {
            input_id = 'player' + (divId) + '-r3';

            console.log("INPUT ID", input_id)
            console.log("PLAYER LEGHT", players.length)
            console.log("DIV ID", divId)
            console.log("I -> ", i)
            console.log("ROUNTWO MATCHES * 2", roundInfo.roundTwoMatches * 2)
            console.log("ROUNTHREE MATCHES * 2", (roundInfo.roundThreeMatches * 2) + lastValue)
            console.log("PLAYER NAME", players[i])
            document.getElementById(input_id).classList.remove('hidden')
            document.getElementById(input_id).textContent = players[i];

            divId++
        }
    }
    nextMatch = nextMatch.map(str => str.slice(0, -1));
    document.getElementById("next-game-players").textContent = nextMatch[0] + " vs " + nextMatch[1]

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

function unloadScripts(scripts) {

	scripts.forEach(script => {
		const scriptElement = document.querySelector(`script[src="${script}"]`);
		if (scriptElement) {
			scriptElement.remove();
		}
	});
}

function tournament_loop() {
	
	unloadScripts(window.gameScripts)
    // debug func | delete after
    // pongyTournamentData.printAllMatches()

    // Make sure you clear the hashchange listener first
    window.removeEventListener('hashchange', clearTournament);
    
    window.addEventListener('hashchange', clearTournament);

    document.getElementById('tournament-area').classList.remove("hidden");

    let tournamentOver = false
    let winner = ""

    if (window.location.hash == '#fighters') {
        document.getElementById('div-game2-area').classList.add("hidden");
        if (fightyTournamentData.matchCounter !== 0 && fightyTournamentData.matchCounter === fightyTournamentData.nrMatches) {
            tournamentOver = true
            winner = fightyTournamentData.getTournamentWinner()
        }
    } else {
        document.getElementById('game-area').classList.add("hidden");
        console.log("MATCH COUNTER: ", pongyTournamentData.matchCounter)
        console.log("NUMBER OF MATCHES: ", pongyTournamentData.nrMatches)
        
        if (pongyTournamentData.matchCounter !== 0 && pongyTournamentData.matchCounter === pongyTournamentData.nrMatches) {
            console.log("I GOT FUCKING HERE")
            tournamentOver = true
            winner = pongyTournamentData.getTournamentWinner()
        }
    }

	if (tournamentOver) {
		// tournament over
		const winnerScreen = document.getElementById('winner-screen');
		winnerScreen.classList.remove("hidden");
        console.log("ADD EVENT LISTNEERRR!!")
		document.getElementById('leave-tournament-button').addEventListener('click', leaveTournament);
        winner = winner.slice(0, -1);
		document.getElementById("winner-message").textContent = "Congratulations, " + winner + "! You are the winner!";
	
	}
    else {
        show_bracket();

        document.getElementById('next-game-button').removeEventListener('click', next_game)
        document.getElementById('next-game-button').addEventListener('click', next_game);
    
        if (window.location.hash == '#fighters') {
            loadScripts(window.game2Scripts);
        } else {
            loadScripts(window.gameScripts);
        }
    }
}

async function storeTournament(namesAndSkins) {
    const data = {
        players: namesAndSkins
    };

    let url;
    if (window.location.hash == '#fighters') {
        url = `https://${window.IP}:3000/solidity/solidity/addtournament/${window.user.blockchain_id}/Fighty`;
        fightyTournamentData.setTournamentSize(namesAndSkins.length)
        fightyTournamentData.addStartingPlayers(namesAndSkins)
    } else {
        url = `https://${window.IP}:3000/solidity/solidity/addtournament/${window.user.blockchain_id}/Pongy`;
        pongyTournamentData.setTournamentSize(namesAndSkins.length)
        pongyTournamentData.addStartingPlayers(namesAndSkins)
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

	if (window.storeGame)
		window.storeGame = false
    return response.json(); // Assuming the response is in JSON format
}

async function start_tournament(playerNamesOrd, playerSkinsOrd) {
    document.getElementById('games-tournament-menu').classList.add("hidden");

    [window.playerNames, window.playerSkins] = shuffle_names(playerNamesOrd, playerSkinsOrd);
    const namesAndSkins = window.playerNames.map((name, skin) => name + window.playerSkins[skin]);

    const gameStatus = await window.getTournamentStatus();

    // Store tournament data and wait for the result
    if (!gameStatus) {
		
		if (!window.storeGame) {

			window.storeGame = true
			await storeTournament(namesAndSkins);  // Wait for the tournament to be stored
		}
		else
		{
			console.log("GAME ALREADY FUCKING HAPPENING")
			return
		}
			

    }

    // Now the tournament is stored, proceed with the tournament loop
    tournament_loop();
}

function clearTournament() {
    document.getElementById('tournament-area').classList.add("hidden");

    // Make sure you're removing the exact listener added previously
    window.removeEventListener('hashchange', clearTournament); 

    if (window.nextGameButton) {
        window.nextGameButton.removeEventListener('click', next_game);
    }

    if (window.endTournamentButton) {
        window.endTournamentButton.removeEventListener('click', leaveTournament);
    }

    unloadScripts(window.tournamentScripts);
}


async function next_game_players() {
    let nextGamePlayers = [];

    if (window.location.hash == '#fighters') {
        nextGamePlayers = fightyTournamentData.getNextTournamentMatch()
    }
    else {
        nextGamePlayers = pongyTournamentData.getNextTournamentMatch()
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
    document.getElementById('tournament-bracket').classList.add("hidden");
    document.getElementById('winner-screen').classList.add("hidden");
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

async function show_bracket()
{
    document.getElementById('tournament-bracket').classList.remove("hidden");

    let players = []
    let roundInfo = {}
    let tournamentSize = 0
 
    if (window.location.hash == '#fighters') {
        players = fightyTournamentData.getBracketPlayerList()
        roundInfo = fightyTournamentData.getRoundInfo()
        tournamentSize = fightyTournamentData.nrPlayers
    }
    else {
        players = pongyTournamentData.getBracketPlayerList()
        roundInfo = pongyTournamentData.getRoundInfo()
        tournamentSize = pongyTournamentData.nrPlayers
    }

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



    // Print round one
    for (i = 0; i < roundInfo.roundOneMatches * 2; i++)
    {
        input_id = 'player' + (i + 1) + '-r1';
        document.getElementById(input_id).textContent = players[i];
    }

    // Print round two
    for (i = roundInfo.roundOneMatches * 2; i < roundInfo.roundTwoMatches * 2; i++)
    {
        input_id = 'player' + (i + 1) + '-r2';
        if (players[i])
            document.getElementById(input_id).textContent = players[i];
    }

    // Print round three
    for (i = roundInfo.roundTwoMatches * 2; i < roundInfo.roundThreeMatches * 2; i++)
    {
        input_id = 'player' + (i + 1) + '-r3';
        if (players[i])
            document.getElementById(input_id).textContent = players[i];
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

function leaveTournament()
{
    clearTournament()
    if (window.location.hash == '#fighters') {
        fightyTournamentData.resetTournament()
    }
    else {
        pongyTournamentData.resetTournament()
    }
    loadScripts(window.menuScripts)
    main_menu()
}

function tournament_loop() {

    // debug func | delete after
    pongyTournamentData.printAllMatches()

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
        if (pongyTournamentData.matchCounter !== 0 && pongyTournamentData.matchCounter === pongyTournamentData.nrMatches) {
            tournamentOver = true
            winner = pongyTournamentData.getTournamentWinner()
        }
    }

    if (tournamentOver) {
        //tournament over
        document.getElementById('winner-screen').classList.remove("hidden");
        document.getElementById('winner-screen').innerHTML = "Congratulations, " + winner + "! You are the winner!"
   
        window.endTournamentButton = document.getElementById('leave-tournament-button');
        window.endTournamentButton.addEventListener('click', leaveTournament);
    }
    else {
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

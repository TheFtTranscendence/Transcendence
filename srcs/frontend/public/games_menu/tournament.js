function clearTournament() {


	// Make sure you're removing the exact listener added previously
	window.removeEventListener('hashchange', clearTournament); 

	document.getElementById('next-game-button').removeEventListener('click', next_game)
	
	if (window.location.hash == '#fighters') {
		if (fightyTournamentData.matchCounter !== 0 && fightyTournamentData.nrMatches === fightyTournamentData.matchCounter)
		{
			clearBracket()
			fightyTournamentData.resetTournament()
		
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
	let nextPlayersSkins = [];

	if (window.location.hash == '#fighters') {
		[nextGamePlayers, nextPlayersSkins] = fightyTournamentData.getNextTournamentMatch()
	}
	else {
		[nextGamePlayers, nextPlayersSkins] = pongyTournamentData.getNextTournamentMatch()
	}

	return [nextGamePlayers, nextPlayersSkins];
}

async function next_game() {
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
		await loadScripts(window.game2Scripts);
		startGame2(playerNames[0], playerNames[1], window.game2Skins[playerSkins[0]], window.game2Skins[playerSkins[1]], true);
	} else {
		document.getElementById('game-area').classList.remove("hidden");

		clearTournament();
		if (!areScriptsLoaded(window.gameScripts)) {
			await PromiseloadScripts(window.gameScripts);
			startGame(playerNames[0], playerNames[1], window.game1Skins[playerSkins[0]], window.game1Skins[playerSkins[1]], playerSkins[0], playerSkins[1], true, false);
		}
	}
	pongyTournamentData.printAllMatches()

}

function areScriptsLoaded(scripts) {
    return scripts.every(src => document.querySelector(`script[src="${src}"]`));
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
		nextMatch = fightyTournamentData.getNextTournamentMatch()[0]
		roundInfo = fightyTournamentData.getRoundInfo()
		tournamentSize = fightyTournamentData.nrPlayers
	}
	else {
		players = pongyTournamentData.getBracketPlayerList()
		nextMatch = pongyTournamentData.getNextTournamentMatch()[0]
		roundInfo = pongyTournamentData.getRoundInfo()
		tournamentSize = pongyTournamentData.nrPlayers
	}

	console.log(pongyTournamentData.getBracketPlayerList())

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
	// 	// Print round three
		document.getElementById("first-match-r3").classList.remove("hidden"); 

		console.log("---------------------")
		console.log("SHOW BRACKET LIST FUNC: ", pongyTournamentData.getBracketPlayerList())
		console.log("SHOW BRACKET LIST: ", players)
		console.log("initial I: ", (roundInfo.roundTwoMatches * 2) + lastValue)
		console.log("END I: ", (roundInfo.roundThreeMatches * 2) + lastValue)

		for (i = lastValue; i < (roundInfo.roundThreeMatches * 2) + lastValue; i++)
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
		document.getElementById("winner-message").textContent = "Congratulations, " + winner + "! You are the winner!";
	
	}
	else {
		show_bracket();

		document.getElementById('next-game-button').removeEventListener('click', next_game)
		document.getElementById('next-game-button').addEventListener('click', next_game);
	
	}
}

async function start_tournament(playerNamesOrd, playerSkinsOrd) {
	document.getElementById('games-tournament-menu').classList.add("hidden");

	[window.playerNames, window.playerSkins] = shuffle_names(playerNamesOrd, playerSkinsOrd);
	// const namesAndSkins = window.playerNames.map((name, skin) => name + window.playerSkins[skin]);

	// Store tournament data and wait for the result
	if (window.location.hash == '#fighters') {
		const gameStatus = await window.getTournamentStatus("Fighty");
		if (!gameStatus) {
			fightyTournamentData.setTournamentSize(window.playerNames.length)
			fightyTournamentData.addStartingPlayers(window.playerNames, window.playerSkins)
			fightyTournamentData.id = await window.storeTournament(window.playerNames, window.playerSkins, "Fighty");  
		}
	}
	else if (window.location.hash == '#game') {
		const gameStatus = await window.getTournamentStatus("Pongy");
		if (!gameStatus) {
			pongyTournamentData.setTournamentSize(window.playerNames.length)
			pongyTournamentData.addStartingPlayers(window.playerNames, window.playerSkins)
			pongyTournamentData.id = await window.storeTournament(window.playerNames, window.playerSkins, "Pongy"); 
		}
	}
			
	tournament_loop();
}

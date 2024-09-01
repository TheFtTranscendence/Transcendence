function clearTournamentMenu() {
	document.getElementById('games-tournament-menu').classList.add('hidden')
	window.removeEventListener('hashchange', tournament_menu_hashchange)

	window.toogle58Button.removeEventListener('click', tournament_extendPlayers)
	window.PlayButton.removeEventListener('click', tournament_play)
	window.BackButton.removeEventListener('click', tournament_backButton)

	window.tournamentskinButton.forEach(function(button) {
		button.removeEventListener('click', handleButtonClick);
	})
	
}

function tournament_play() {
	console.log('Play button clicked')
	
	const playerNames = []
	const playerSkins = []
	
	if (document.querySelectorAll('.games-tournament-player-info2')[0].style.display === 'flex')
		nb_players = 8
	else
		nb_players = 4

	console.log(nb_players)
	for (n = 1; n <= nb_players; n++) {
		const playerName = document.getElementById('games-tournament-player-name' + n).value.trim()
		if (playerName.length == 0) {
			alert('Please enter the names of all players')
			return
		}
		playerNames.push(playerName)
		playerSkins.push(window.tournamentPlayerSkins[n - 1])
	}

	console.log(playerNames)
	console.log(playerSkins)
	
	
	clearTournamentMenu()
	UnloadScripts(window.menuScripts)
	if (window.location.hash == '#fighters') {
		// Load scripts for tournament
	} else {
		// Pong Change
	}
}

function tournament_backButton() {
	console.log("Tournament Back button clicked");

	clearTournamentMenu()
	main_menu()
}

function tournament_menu_hashchange() {
	console.log("Tournament HashChange");
	clearTournamentMenu()
	UnloadScripts(window.menuScripts)
}

function tournament_extendPlayers() {

	console.log("Extend Players button clicked");
	
	document.querySelectorAll('.games-tournament-player-info2').forEach(function(player) {
		if (player.style.display === 'flex') {
			player.style.display = 'none';
		} else {
			player.style.display = 'flex';
		}
	});
}

function games_tournament_menu() {

	document.getElementById('games-tournament-menu').classList.remove('hidden')

	if (window.location.hash == '#fighters') {
		// loadScripts(window.game2Scripts)
		window.tournamentPlayerSkins = [0, 0, 0, 0, 0, 0, 0, 0]
		for (n = 1; n <= 8; n++) {
			document.getElementById('games-tournament-player-skin' + n).style.backgroundImage = "url('" + window.game2SkinsPreviews[0] + "')"
		}

	} else {
		// Pong Change, put default skins for pong
		// window.tournamentPlayerSkins = [0, 0, 0, 0, 0, 0, 0, 0]
		// for (n = 1; n <= 8; n++) {
		// 	document.getElementById('games-tournament-player-skin' + n).style.backgroundImage = "url('" + window.gameSkinsPreviews[0] + "')"
		// }
	}

	window.addEventListener('hashchange', tournament_menu_hashchange)
	
	window.toogle58Button = document.getElementById('toggle-extended-players')
	window.PlayButton = document.getElementById('games-tournament-button-play')
	window.BackButton = document.getElementById('games-tournament-button-back')

	window.tournamentskinButton = [
		document.getElementById('games-tournament-button-skin1'),
		document.getElementById('games-tournament-button-skin2'),
		document.getElementById('games-tournament-button-skin3'),
		document.getElementById('games-tournament-button-skin4'),
		document.getElementById('games-tournament-button-skin5'),
		document.getElementById('games-tournament-button-skin6'),
		document.getElementById('games-tournament-button-skin6'),
		document.getElementById('games-tournament-button-skin7'),
		document.getElementById('games-tournament-button-skin8')
	]
	

	window.toogle58Button.addEventListener('click', tournament_extendPlayers)
	window.PlayButton.addEventListener('click', tournament_play)
	window.BackButton.addEventListener('click', tournament_backButton)

	window.tournamentskinButton.forEach(function(button) {
		button.addEventListener('click', handleButtonClick);
	})
	
}

function handleButtonClick(event) {
	
	const buttonId = event.target.id;
    const lastChar = buttonId.charAt(buttonId.length - 1);
    const buttonNumber = parseInt(lastChar, 10);

    tournament_skinbutton(buttonNumber);
}

function tournament_skinbutton(buttonId) {
    console.log(`Skin Button clicked: ${buttonId}`);
	
	if (window.location.hash == '#fighters')
	{
		if (window.tournamentPlayerSkins[buttonId - 1] == window.game2SkinsPreviews.length - 1)
			window.tournamentPlayerSkins[buttonId - 1] = 0;
		else
			window.tournamentPlayerSkins[buttonId - 1]++;
		document.getElementById('games-tournament-player-skin' + buttonId).style.backgroundImage = "url('" + window.game2SkinsPreviews[window.tournamentPlayerSkins[buttonId - 1]] + "')";
	} else {
		// Pong Change
		// Change skins in pong
	}
}
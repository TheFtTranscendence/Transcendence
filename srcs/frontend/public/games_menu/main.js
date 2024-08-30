function games_menu_hashchange() {
	
	window.removeEventListener('hashchange', games_menu_hashchange)

	window.changeSkinButton.removeEventListener('click', main_menu_changeSkinButton);
	window.matchmakingButton.removeEventListener('click', main_menu_matchmakingButton);
	window.localButton.removeEventListener('click', main_menu_localButton);
	window.tournament.removeEventListener('click', main_menu_tournamentButton);
	
	document.getElementById('games-menu-area').classList.add("hidden")
	document.getElementById('games').classList.add("hidden")
}

function main_menu_changeSkinButton () {
	console.log('Change Skin button clicked');
	// Add functionality for changing the skin
}

function main_menu_matchmakingButton () {
	console.log('Matchmaking button clicked');
	// Add functionality for changing the skin
}

function main_menu_tournamentButton() {
	console.log('Tournament button clicked');
	// Add functionality for changing the skin
}

function main_menu_localButton() {
	window.changeSkinButton.removeEventListener('click', main_menu_changeSkinButton);
	window.matchmakingButton.removeEventListener('click', main_menu_matchmakingButton);
	window.localButton.removeEventListener('click', main_menu_localButton);
	window.tournament.removeEventListener('click', main_menu_tournamentButton);

	document.getElementById('games-menu-area').classList.add("hidden");
	
	games_local_menu();
}


function main_menu() {
	
	document.getElementById('games-menu-area').classList.remove("hidden")

	if (window.location.hash == '#fighters') {

		document.getElementById('games-menu-title').textContent = 'Fighty Fighters'
		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('game2/assets/Mask/Sprites/preview.gif')"
	} else {
		
		document.getElementById('games-menu-title').textContent = 'Pongy'
		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('game/path/skin.png')" // Pong Change
	}
	
	window.addEventListener('hashchange', games_menu_hashchange)

	window.changeSkinButton = document.getElementById('games-button-skin')
	window.matchmakingButton = document.getElementById('games-button-Matchmaking')
	window.localButton = document.getElementById('games-button-local')
	window.tournament = document.getElementById('games-button-tournament')
	
	window.changeSkinButton.addEventListener('click', main_menu_changeSkinButton);
	window.matchmakingButton.addEventListener('click', main_menu_matchmakingButton);
	window.localButton.addEventListener('click', main_menu_localButton);
	window.tournament.addEventListener('click', main_menu_tournamentButton);
	
}
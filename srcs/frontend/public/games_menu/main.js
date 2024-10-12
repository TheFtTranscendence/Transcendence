function clearMenu() {

	window.removeEventListener('hashchange', games_menu_hashchange)

	window.changeSkinButton.removeEventListener('click', main_menu_changeSkinButton)
	window.matchmakingButton.removeEventListener('click', main_menu_matchmakingButton)
	window.localButton.removeEventListener('click', main_menu_localButton)
	window.tournament.removeEventListener('click', main_menu_tournamentButton)

	
	document.getElementById('games-menu-area').classList.add("hidden")
}

function games_menu_hashchange() {
	
	clearMenu()
	unloadScripts(window.menuScripts)
	document.getElementById('games').classList.add("hidden")
}

async function main_menu_changeSkinButton () {
	console.log('Change Skin button clicked')

	if (window.location.hash == '#fighters') {

		if (window.user.preferences.fighty_skin == window.game2SkinsPreviews.length - 1) {
			await modify_user_preferences("fighty_skin", 0)
			new_skin = 0
		}
		else {
			await modify_user_preferences("fighty_skin", window.user.preferences.fighty_skin + 1)
			new_skin = window.user.preferences.fighty_skin + 1
		}

		update_user_info()
		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game2SkinsPreviews[new_skin] + "')" 
	}
	else {
		// Add functionality for changing the skin Pong Change
	}
}

function main_menu_matchmakingButton () {
	console.log('Matchmaking button clicked')
	if (window.location.hash == '#fighters') {

		clearMenu()
		unloadScripts(window.menuScripts)
		loadScripts(window.matchmakingScripts, 'Matchmaking_before_game') // To change for optimization
	}
	else {
		// Load the scripts for pong matchmaking
		// Pong change
	}
}

function main_menu_tournamentButton() {
	console.log('Tournament button clicked')
	clearMenu()
	games_tournament_menu()
}

function main_menu_localButton() {
	console.log('Local button clicked')
	clearMenu()
	games_local_menu()
}

function main_menu() {
	
	document.getElementById('games-menu-area').classList.remove("hidden")
	
	if (window.location.hash == '#fighters') {
		
		document.getElementById('games-menu-title').textContent = 'Fighty Fighters'
		try {
			document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game2SkinsPreviews[window.user.preferences.fighty_skin] + "')" 
		} catch {
			toast_alert("Error setting skin")
		}
	} else {
		
		document.getElementById('games-menu-title').textContent = 'Pongy'
		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('game/path/skin.png')" // Pong Change
	}

	window.addEventListener('hashchange', games_menu_hashchange)
	
	window.changeSkinButton = document.getElementById('games-button-skin')
	window.matchmakingButton = document.getElementById('games-button-Matchmaking')
	window.localButton = document.getElementById('games-button-local')
	window.tournament = document.getElementById('games-button-tournament')
	
	window.changeSkinButton.addEventListener('click', main_menu_changeSkinButton)
	window.matchmakingButton.addEventListener('click', main_menu_matchmakingButton)
	window.localButton.addEventListener('click', main_menu_localButton)
	window.tournament.addEventListener('click', main_menu_tournamentButton)
	
}

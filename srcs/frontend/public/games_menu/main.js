function clearMenu() {

	window.removeEventListener('hashchange', games_menu_hashchange)

	window.changeSkinButton.removeEventListener('click', main_menu_changeSkinButton)
	window.matchmakingButton.removeEventListener('click', main_menu_matchmakingButton)
	window.localButton.removeEventListener('click', main_menu_localButton)
	window.tournament.removeEventListener('click', main_menu_tournamentButton)

	console.log("CLEAR MENU LISTNERS")
	
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

		if (window.pongPlayerSkins == window.game1SkinsPreview.length - 1)
			window.pongPlayerSkins = 0
		else
			window.pongPlayerSkins++

		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game1SkinsPreview[window.pongPlayerSkins] + "')" 
	}
}

function areScriptsLoaded(scripts) {
    return scripts.every(src => document.querySelector(`script[src="${src}"]`));
}

async function main_menu_matchmakingButton () {
	console.log('Matchmaking button clicked')
	console.log("GAMES GOING ON COUNTER ->", window.gamesOnCounter)
	if (window.location.hash == '#fighters') {

		clearMenu()
		await PromiseloadScripts(window.matchmakingScripts)
		unloadScripts(window.menuScripts)
		Matchmaking_before_game()
		
	}
	else {
		// Load the scripts for pong matchmaking
		// Pong change
		document.getElementById('games-button-Matchmaking').removeEventListener('click', main_menu_matchmakingButton)
		clearMenu()
		unloadScripts(window.menuScripts)
		if (!areScriptsLoaded(window.gameScripts)) {
			await PromiseloadScripts(window.gameScripts)
			console.log("AT main_menu_matchmakingButton")
			startMatchmakingQueue()
        }
	}
}

function loadScriptss(scriptUrls) {
    return Promise.all(scriptUrls.map(url => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.head.appendChild(script);
        });
    }));
}


async function main_menu_tournamentButton() {
	console.log('Tournament button clicked')
	clearMenu()	

	if (window.location.hash == '#fighters') {
		const gameStatus = await window.getTournamentStatus("Fighty");
		if (!gameStatus) {
			games_tournament_menu()
		}
		else {
			unloadScripts(window.menuScripts)
			await loadScriptss(window.tournamentScripts)
			tournament_loop()
		}
	}
	else if (window.location.hash == '#game') {
		const gameStatus = await window.getTournamentStatus("Pongy");
		if (!gameStatus) {
			games_tournament_menu()
		}
		else {
			if (!areScriptsLoaded(window.tournamentScripts)) {
				unloadScripts(window.menuScripts)
				await loadScriptss(window.tournamentScripts)
				tournament_loop()
			}
		}
	}
}

function main_menu_localButton() {
	console.log('Local button clicked')
	clearMenu()
	games_local_menu()
}

function main_menu() {

	document.getElementById('games').classList.remove("hidden")
	document.getElementById('games-menu-area').classList.remove("hidden")
	
	if (window.location.hash == '#fighters') {
		
		document.getElementById('games-menu-title').textContent = 'Fighty Fighters'
		try {
			document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game2SkinsPreviews[window.user.preferences.fighty_skin] + "')" 
		} catch {
			toast_alert("Error setting skin")
		}
	} else {
		window.pongPlayerSkins = 0
		document.getElementById('games-menu-title').textContent = 'Pongy'
		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game1SkinsPreview[window.pongPlayerSkins] + "')" 
	}

	// pongyTournamentData.printAllMatches()
	console.log("AT MAIN MENU ->")

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

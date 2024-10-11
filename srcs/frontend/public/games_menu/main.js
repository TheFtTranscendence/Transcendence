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

function main_menu_changeSkinButton () {
	console.log('Change Skin button clicked')

	if (window.location.hash == '#fighters') {

		if (window.user.preferences.fighty_skin == window.game2SkinsPreviews.length - 1)
			modify_user("preferences", {fighty_skin: 0, pongy: window.user.preferences.pongy_skin})
		else
			modify_user("preferences", {fighty_skin: window.user.preferences.pongy_skin + 1, pongy: window.user.preferences.pongy_skin})

		update_user_info()
		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game2SkinsPreviews[window.user.preferences.fighty_skin] + "')" 
	}
	else {

		if (window.pongPlayerSkins == window.game1SkinsPreview.length - 1)
			window.pongPlayerSkins = 0
		else
			window.pongPlayerSkins++

		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game1SkinsPreview[window.pongPlayerSkins] + "')" 
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
		clearMenu()
		unloadScripts(window.menuScripts)
		loadScriptss(window.gameScripts)
		startGame("p1", "p2", window.game1Skins[0], window.game1Skins[1], 0, 1, false, true)
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

    // axios.get('http://localhost:8001/solidity/getlasttournamentranking/' + window.user.blockchain_id + "/Pongy")
	// .then((response) => {
    //     console.log("Current TOURNEY");
	// 	console.log(response.data);
	// })
	// .catch((error) => {
	// 	console.error(error);
	// 	if (error.response)	{
	// 		const status = error.response.status;
	// 	}
	// });


	// axios.get('http://localhost:8001/solidity/getalltournamentsrankings/' + window.user.blockchain_id + "/Pongy")
	// .then((response) => {
	// 	console.log("ALL TOURNEY");
	// 	console.log(response.data);
	// })
	// .catch((error) => {
	// 	console.error(error);
	// 	if (error.response)	{
	// 		const status = error.response.status;
	// 	}
	// });

	const gameStatus = await window.getTournamentStatus();

	if (window.location.hash == '#fighters' && !gameStatus) {
		games_tournament_menu()
	}
	else if (window.location.hash == '#game' && !gameStatus)
	{
		games_tournament_menu()
	}
	else
	{
		unloadScripts(window.menuScripts)
		await loadScriptss(window.tournamentScripts)
		tournament_loop()
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
		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game2SkinsPreviews[window.user.preferences.fighty_skin] + "')" 
	} else {
		window.pongPlayerSkins = 0
		document.getElementById('games-menu-title').textContent = 'Pongy'
		document.getElementById('games-menu-selected-skin').style.backgroundImage = "url('" + window.game1SkinsPreview[window.pongPlayerSkins] + "')" 
	}


	// const url = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Pongy`;
	// fetch(url, {
	// 	method: 'GET', // Use 'GET' for fetching data
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	}
	// })
	// .then(response => {
	// 	if (!response.ok) {
	// 		throw new Error(`Error fetching data: ${response.statusText}`);
	// 	}
	// 	return response.json(); // Assuming the response is in JSON format
	// })
	// .then(data => {
	// 	console.log('TOURNEY STATUS:', data);
	// 	// Process the data here (for example, display it on the UI)
	// })
	// .catch(error => {
	// 	console.error('Error:', error);
	// });

	// const url2 = `https://${window.IP}:3000/solidity/solidity/getcurrenttournamentplayerslist/${window.user.blockchain_id}/Pongy`;
	// fetch(url2, {
	// 	method: 'GET', // Use 'GET' for fetching data
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	}
	// })
	// .then(response => {
	// 	if (!response.ok) {
	// 		throw new Error(`Error fetching data: ${response.statusText}`);
	// 	}
	// 	return response.json(); // Assuming the response is in JSON format
	// })
	// .then(data => {
	// 	console.log('TOURNEY PLAYERS:', data);
	// 	// Process the data here (for example, display it on the UI)
	// })
	// .catch(error => {
	// 	console.error('Error:', error);
	// });


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

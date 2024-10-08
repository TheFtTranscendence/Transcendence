function clearLocalMenu() {
	window.removeEventListener('hashchange', local_menu_hashchange)
	window.changeSkinButton1.removeEventListener('click', local_changeSkinButton1)
	window.changeSkinButton2.removeEventListener('click', local_changeSkinButton2)
	window.playButton.removeEventListener('click', local_play)
	window.backButton.removeEventListener('click', local_backbutton)
	
	if (window.location.hash == '#fighters') {
		unloadScripts(window.game2Scripts)
	}
	else {
		// unloadScripts(window.gameScripts) Pong Change
	}

	document.getElementById('games-local-menu').classList.add("hidden")
}

function local_menu_hashchange() {
	clearLocalMenu()
	unloadScripts(window.menuScripts)
}

function local_changeSkinButton1() {
	console.log('Change Skin button 1 clicked');

	if (window.location.hash == '#fighters') {
		if (window.player1Skin == window.game2SkinsPreviews.length - 1)
			window.player1Skin = 0
		else
			window.player1Skin++

		document.getElementById('games-local-player1-skin').style.backgroundImage =  "url('" + window.game2SkinsPreviews[window.player1Skin] + "')" 
	}
	else 
	{
		// Pong Change
	}
}

function local_changeSkinButton2() {
	console.log('Change Skin button 2 clicked');

	if (window.location.hash == '#fighters') {
		if (window.player2Skin == window.game2SkinsPreviews.length - 1)
			window.player2Skin = 0
		else
			window.player2Skin++

		document.getElementById('games-local-player2-skin').style.backgroundImage =  "url('" + window.game2SkinsPreviewsInverted[window.player2Skin] + "')" 
	}
	else 
	{
		// Pong Change
	}
}

function local_play() {
	const player1name = document.getElementById('games-player1-name').value
	const player2name = document.getElementById('games-player2-name').value

	if (player1name === '' || player2name === '') {
		alert('Please enter the names of both players')
		return
	}
	
	window.removeEventListener('hashchange', local_menu_hashchange)

	window.changeSkinButton1.addEventListener('click', local_changeSkinButton1)
	window.changeSkinButton2.addEventListener('click', local_changeSkinButton2)
	window.playButton.addEventListener('click', local_play)
	window.backButton.removeEventListener('click', local_backbutton)


	window.playButton.removeEventListener('click', local_play)
	document.getElementById('games-local-menu').classList.add("hidden")

	unloadScripts(window.menuScripts)
	if (window.location.hash == '#fighters') {
		document.getElementById('div-game2-area').classList.remove("hidden")
		startGame2(player1name, player2name, window.game2Skins[window.player1Skin], window.game2Skins[window.player2Skin])
	} else {

		// document.getElementById('div-game-area').classList.remove("hidden") // Pong Change
		// Load scritps here for Pong game so there's no delay when starting// Pong Change
	}

}

function local_backbutton() {
	clearLocalMenu()
	main_menu()
}

function games_local_menu() {
	document.getElementById('games-local-menu').classList.remove("hidden");

	if (window.location.hash == '#fighters') {
		loadScripts(window.game2Scripts)

		window.player1Skin = 0
		window.player2Skin = 0
		document.getElementById('games-local-player1-skin').style.backgroundImage =  "url('" + window.game2SkinsPreviews[window.player1Skin] + "')" 
		document.getElementById('games-local-player2-skin').style.backgroundImage =  "url('" + window.game2SkinsPreviewsInverted[window.player2Skin] + "')" 
	} else {

		// loadScripts(window.gameScritps) Load scripts for pong game so there's no delay when user presses play button  // Pong Change
		
		document.getElementById('games-local-player1-skin').style.backgroundImage = "url('path/to/skin.png')" // Pong Change
		document.getElementById('games-local-player2-skin').style.backgroundImage = "url('path/to/skin.png')" // Pong Change
	}

	window.addEventListener('hashchange', local_menu_hashchange)

	window.changeSkinButton1 = document.getElementById('games-button-skin1')
	window.changeSkinButton2 = document.getElementById('games-button-skin2')
	window.playButton = document.getElementById('games-local-button-play')
	window.backButton = document.getElementById('games-local-button-back')
	
	window.changeSkinButton1.addEventListener('click', local_changeSkinButton1)
	window.changeSkinButton2.addEventListener('click', local_changeSkinButton2)
	window.playButton.addEventListener('click', local_play)
	window.backButton.addEventListener('click', local_backbutton)


}

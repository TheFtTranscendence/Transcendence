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
		unloadScripts(window.gameScripts)
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
		if (window.pongPlayer1Skin == window.game1SkinsPreview.length - 1)
			window.pongPlayer1Skin = 0
		else
			window.pongPlayer1Skin++

		document.getElementById('games-local-player1-skin').style.backgroundImage =  "url('" + window.game1SkinsPreview[window.pongPlayer1Skin] + "')" 
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
		if (window.pongPlayer2Skin == window.game1SkinsPreview.length - 1)
			window.pongPlayer2Skin = 0
		else
			window.pongPlayer2Skin++

		document.getElementById('games-local-player2-skin').style.backgroundImage =  "url('" + window.game1SkinsPreview[window.pongPlayer2Skin] + "')" 
	}
}

function local_play() {
	const player1name = document.getElementById('games-player1-name').value
	const player2name = document.getElementById('games-player2-name').value

	if (player1name === '' || player2name === '') {
		toast_alert('Please enter the names of both players')
		return
	}
	
	window.removeEventListener('hashchange', local_menu_hashchange)

	window.changeSkinButton1.removeEventListener('click', local_changeSkinButton1)
	window.changeSkinButton2.removeEventListener('click', local_changeSkinButton2)
	window.playButton.removeEventListener('click', local_play)
	window.backButton.removeEventListener('click', local_backbutton)


	window.playButton.removeEventListener('click', local_play)
	document.getElementById('games-local-menu').classList.add("hidden")

	unloadScripts(window.menuScripts)
	if (window.location.hash == '#fighters') {
		document.getElementById('div-game2-area').classList.remove("hidden")
		startGame2(player1name, player2name, window.game2Skins[window.player1Skin], window.game2Skins[window.player2Skin], -1, -1, false)
	} else {

		document.getElementById('game-area').classList.remove("hidden")
		startGame(player1name, player2name, window.game1Skins[window.pongPlayer1Skin], window.game1Skins[window.pongPlayer2Skin], -1, -1, false, false)
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

		loadScripts(window.gameScripts)
		window.pongPlayer1Skin = 0
		window.pongPlayer2Skin = 0
		document.getElementById('games-local-player1-skin').style.backgroundImage = "url('" + window.game1SkinsPreview[window.pongPlayer1Skin] + "')" 
		document.getElementById('games-local-player2-skin').style.backgroundImage = "url('" + window.game1SkinsPreview[window.pongPlayer2Skin] + "')" 
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

function local_menu_hashchange() {
	window.removeEventListener('hashchange', local_menu_hashchange)

	
	window.changeSkinButton1.removeEventListener('click', local_changeSkinButton1)
	window.changeSkinButton2.removeEventListener('click', local_changeSkinButton2)
	window.playButton.removeEventListener('click', local_play)
	window.backButton.removeEventListener('click', local_backbutton)
	
	if (window.location.hash == '#fighters') {
		UnloadScripts(window.game2Scripts)
	}
	else {
		// UnloadScripts(window.gameScripts) Pong Change
	}
	
	document.getElementById('games-local-menu').classList.add("hidden")
}

function local_changeSkinButton1() {
	console.log('Change Skin button 1 clicked');
	// Add functionality for changing the skin
}

function local_changeSkinButton2() {
	console.log('Change Skin button 2 clicked');
	// Add functionality for changing the skin
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

	if (window.location.hash == '#fighters') {
		document.getElementById('div-game2-area').classList.remove("hidden")
		startGame2(player1name, player2name)
	} else {
		// document.getElementById('div-game-area').classList.remove("hidden") // Pong Change
	}

}

function local_backbutton() {
	local_menu_hashchange()
	main_menu()
}

function games_local_menu() {
	document.getElementById('games-local-menu').classList.remove("hidden");

	if (window.location.hash == '#fighters') {
		loadScripts(window.game2Scripts)

		document.getElementById('games-local-player1-skin').style.backgroundImage = "url('game2/assets/Mask/Sprites/preview.gif')"
		document.getElementById('games-local-player2-skin').style.backgroundImage = "url('game2/assets/Mask/Sprites/preview.gif')"
	} else {

		// loadScripts(window.gameScritps) Load scripts for pong game so there's no delay when user presses play button Pong Change
		
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

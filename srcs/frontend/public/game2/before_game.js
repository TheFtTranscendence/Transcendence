function game2_changeSkinButton () {
	// Add functionality for changing the skin
}

function game2_matchmakingButton () {
	// Add functionality for changing the skin
}

function game2_tournamentButton() {
	// Add functionality for changing the skin
}

function game2_localButton() {
	window.changeSkinButton.removeEventListener('click', game2_changeSkinButton);
	window.matchmakingButton.removeEventListener('click', game2_matchmakingButton);
	window.localButton.removeEventListener('click', game2_localButton);

	document.getElementById('game2-menu-area').classList.add("hidden");
	document.getElementById('game2-local-menu').classList.remove("hidden");
	
	game2_local_menu();
}

function game2_menu_hashchange() {
	
	window.removeEventListener('hashchange', game2_menu_hashchange)
	document.getElementById('game2-menu-area').classList.add("hidden")
}

function before_game()
{

	window.addEventListener('hashchange', game2_menu_hashchange)
	
	window.changeSkinButton = document.getElementById('game2-button-skin')
	window.matchmakingButton = document.getElementById('game2-button-Matchmaking')
	window.localButton = document.getElementById('game2-button-local')
	window.tournament = document.getElementById('game2-button-tournament')
	

	try {
		document.getElementById('game2-menu-player-name').textContent = window.user.username
	} catch {}

	document.getElementById('game2-menu-area').classList.remove("hidden");
	
	window.changeSkinButton.addEventListener('click', game2_changeSkinButton);
	window.matchmakingButton.addEventListener('click', game2_matchmakingButton);
	window.localButton.addEventListener('click', game2_localButton);
	window.tournament.addEventListener('click', game2_tournamentButton);
	
}

function game2_local_play() {
	const player1name = document.getElementById('game2-player1-name').value
	const player2name = document.getElementById('game2-player2-name').value

	if (player1name === '' || player2name === '') {
		toast_alert('Please enter the names of both players')
		return
	}

	document.getElementById('game2-local-menu').classList.add("hidden")
	document.getElementById('div-game2-area').classList.remove("hidden")

	startGame2(player1name, player2name)
	
}

function game2_local_menu() {
	window.playButton = document.getElementById('game2-button-play')
	
	window.playButton.addEventListener('click', game2_local_play)

    

}
function before_game()
{
	// Ask nickname from the players
	// v.player.name = nickname1
	// v.enemy.name = nickname2
	
	console.log('before game 2')

	document.getElementById('game2-menu-area').classList.remove("hidden");
	
	const changeSkinButton = document.getElementById('change-skin');
	const matchmakingButton = document.getElementById('matchmaking');
	const localButton = document.getElementById('local');

	// Add event listeners to buttons
	changeSkinButton.addEventListener('click', () => {
		console.log('Change Skin button clicked');
		// Add functionality for changing the skin
	});

	matchmakingButton.addEventListener('click', () => {
		console.log('Matchmaking button clicked');
		// Add functionality for matchmaking
	});

	localButton.addEventListener('click', () => {
		console.log('Local button clicked');
		// Add functionality for local play
	});
	
	// startGame2()
}
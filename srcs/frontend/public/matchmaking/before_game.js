function Matchmaking_before_game(invite = false, sender = null, receiver = null)
{
	console.log('before game 2')
	
	try {
		toast_alert('Searching for match...')
	} catch {
		alert('Searching for match...')
	}

	
	
	v = Matchmaking_init_vars()
	Matchmaking_setup_canvas(v)
	
	if (invite == false)
		Matchmaking_queue(v)
	else {
		console.log('game_id', sender.game_id)
		Matchmaking_invite(v, sender, receiver)
	}
}
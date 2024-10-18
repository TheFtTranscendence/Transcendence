function Matchmaking_before_game(invite = false, sender = null, receiver = null)
{
	
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
		Matchmaking_invite(v, sender, receiver)
	}
}
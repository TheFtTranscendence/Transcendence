function Matchmaking_before_game()
{
	// Ask nickname from the players
	// v.player.name = nickname1
	// v.enemy.name = nickname2
	
	console.log('before game 2')

	v = Matchmaking_init_vars()
	Matchmaking_setup_canvas(v)

	Matchmaking_queue(v)

}
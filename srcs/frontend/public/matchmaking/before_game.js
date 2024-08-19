function before_game()
{
	// Ask nickname from the players
	// v.player.name = nickname1
	// v.enemy.name = nickname2
	
	console.log('before game 2')

	v = init_vars()
	setup_canvas(v)
	setup_socket(v)
	
	// setup_music(v)
	
	

	
	
	startGame2(v)


}
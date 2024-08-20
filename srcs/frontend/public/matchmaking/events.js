function Matchmaking_game2_keydown(event) {
	console.log('user_id = ' + window.user.id)
	console.log('player 1 = ' + v.s.player1)
	console.log('player 2 = ' + v.s.player2)
	
	if (window.user.id == v.s.player1)
	{
		switch (event.key) {
			case 'd':
				v.keys.d.pressed = true;
				v.player.lastKey = 'd';
				v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'd_keydown'}))
				break
	
			case 'a':
				v.keys.a.pressed = true;
				v.player.lastKey = 'a';
				v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'a_keydown'}))
				break
	
			case 'w':
				v.keys.w.pressed = true;
				v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'w_keydown'}))
				break
	
			case ' ':
				v.player.attack();
				v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'attack'}))
				break
		}
	}
	else if (window.user.id == v.s.player2)
	{
		switch (event.key) {
			case 'd':
				v.keys.ArrowRight.pressed = true;
				v.enemy.lastKey = 'ArrowRight';
				v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'ArrowRight_keydown'}))
				break
	
			case 'a':
				v.keys.ArrowLeft.pressed = true;
				v.enemy.lastKey = 'ArrowLeft';
				v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'ArrowLeft_keydown'}))
				break
	
			case 'w':
				v.keys.ArrowUp.pressed = true;
				v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'ArrowUp_keydown'}))
				break
	
			case ' ':
				v.enemy.attack();
				v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'attack'}))
				break
		}
	}

}

function Matchmaking_game2_keyup(event) {
	if (window.user.id == v.s.player1)
		{
			switch (event.key) {
				case 'd':
					v.keys.d.pressed = false;
					v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'd_keyup'}))
					break
		
				case 'a':
					v.keys.a.pressed = false;
					v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'a_keyup'}))
					break
		
				case 'w':
					v.keys.w.pressed = false;
					v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'w_keyup'}))
					break
			}
		}
		else if (window.user.id == v.s.player2)
		{
			switch (event.key) {
				case 'd':
					v.keys.ArrowRight.pressed = false;
					v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'ArrowRight_keyup'}))
					break
		
				case 'a':
					v.keys.ArrowLeft.pressed = false;
					v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'ArrowLeft_keyup'}))
					break
		
				case 'w':
					v.keys.ArrowUp.pressed = false;
					v.s.game_socket.send(JSON.stringify({player_id: window.user.id, action: 'ArrowUp_keyup'}))
					break
			}
		}
}

function Matchmaking_game2_hashchange(event) {
	console.log('leaving game')
	Matchmaking_leave_game(v)
	
}
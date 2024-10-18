function Matchmaking_game2_keydown(event) {
	console.log("SENDIND aahh")
	
	if (window.user.id == v.s.player1)
	{
		switch (event.key) {
			case 'd':
				console.log("SENDIND D")
				v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'd_keydown'}))
				break
	
			case 'a':
				v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'a_keydown'}))
				break
	
			case 'w':
				v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'w_keydown'}))
				break
	
			case ' ':
				v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'attack_1'}))
				break
		}
	}
	else if (window.user.id == v.s.player2)
	{
		switch (event.key) {
			case 'd':
				console.log("SENDIND D")
				v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'ArrowRight_keydown'}))
				break
	
			case 'a':
				v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'ArrowLeft_keydown'}))
				break
	
			case 'w':
				v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'ArrowUp_keydown'}))
				break
	
			case ' ':
				v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'attack_2'}))
				break
		}
	}

}

function Matchmaking_game2_keyup(event) {
	if (window.user.id == v.s.player1)
		{
			switch (event.key) {
				case 'd':
					v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'd_keyup'}))
					break
		
				case 'a':
					v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'a_keyup'}))
					break
		
				case 'w':
					v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'w_keyup'}))
					break
			}
		}
		else if (window.user.id == v.s.player2)
		{
			switch (event.key) {
				case 'd':
					v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'ArrowRight_keyup'}))
					break
		
				case 'a':
					v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'ArrowLeft_keyup'}))
					break
		
				case 'w':
					v.s.game_socket.send(JSON.stringify({type: 'move', player_id: window.user.id, action: 'ArrowUp_keyup'}))
					break
			}
		}
}

function Matchmaking_game2_hashchange(event) {
	console.log('leaving game')
	Matchmaking_leave_game(v, true)
	
}
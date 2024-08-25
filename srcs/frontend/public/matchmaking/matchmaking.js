function Matchmaking_queue(v)
{
	v.s.queue_socket = new WebSocket('ws://localhost:8004/ws/queue/' + window.user.id + '/Fighty/');

	v.s.queue_socket.onmessage = function(event) {
		msg = JSON.parse(event.data)

		v.s.player1 = msg.player1
		v.s.player2 = msg.player2
		v.s.gameId = msg.game_id
		
		Matchmaking_setup_socket(v)
		Matchmaking_startGame2(v)

	}
}

function Matchmaking_setup_socket(v) {

	
	v.s.game_socket = new WebSocket('ws://localhost:8004/ws/remote_access/' + v.s.gameId + '/');

	
	v.s.game_socket.onmessage = function(event) {
		msg = JSON.parse(event.data)
		if (msg.player_id != window.user.id)
		{
			console.log(window.user.id, " received: ", msg)
			if (window.user.id == v.s.player1)
			{
				switch (msg.action) {
					case 'ArrowRight_keydown': v.keys.ArrowRight.pressed = true; v.enemy.lastKey = 'ArrowRight'; break;
					case 'ArrowRight_keyup': v.keys.ArrowRight.pressed = false; break;
					case 'ArrowLeft_keydown': v.keys.ArrowLeft.pressed = true; v.enemy.lastKey = 'ArrowLeft'; break;
					case 'ArrowLeft_keyup': v.keys.ArrowLeft.pressed = false; break;
					case 'ArrowUp_keydown': v.keys.ArrowUp.pressed = true; break;
					case 'ArrowUp_keyup': v.keys.ArrowUp.pressed = false; break;
				}
			}
			else if (window.user.id == v.s.player2)
			{
				switch (msg.action) {
					case 'd_keydown': v.keys.d.pressed = true; v.player.lastKey = 'd'; break;
					case 'd_keyup': v.keys.d.pressed = false; break;
					case 'a_keydown': v.keys.a.pressed = true; v.player.lastKey = 'a'; break;
					case 'a_keyup': v.keys.a.pressed = false; break;
					case 'w_keydown': v.keys.w.pressed = true; break;
					case 'w_keyup': v.keys.w.pressed = false; break;
				}
			}
			
			
			if (msg.action == 'attack')
			{
				if (msg.player_id == v.s.player1)
					v.player.attack()
				else
					v.enemy.attack()
			}
		}
	}
}
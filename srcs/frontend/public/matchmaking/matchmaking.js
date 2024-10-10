function matchmaking_hashchange() {
	console.log('hashchange game2');
	window.removeEventListener('hashchange', matchmaking_hashchange)
	alert('Matchmaking cancelled')
}

function Matchmaking_queue(v)
{
	console.log('connecting to WebSocket')
	v.s.queue_socket = new WebSocket(`wss://${window.IP}:3000/remote-players/ws/queue/?game=Fighty&user_id=` + window.user.id);

	window.addEventListener('hashchange', matchmaking_hashchange)

	
	v.s.queue_socket.onmessage = function(event) {
		msg = JSON.parse(event.data)
		console.log(msg)

		if (window.user.id == msg.player1 ) {
			v.player.name = window.user.username
			v.player.sprites = window.game2Skins[window.user.preferences.fighty_skin]
			
			user2 = get_user_info(msg.player2)
			v.enemy.name = user2.username
			v.enemy.sprites = window.game2Skins[user2.preferences.fighty_skin]
		} else {
			v.enemy.name = window.user.username
			v.enemy.sprites = window.game2Skins[window.user.preferences.fighty_skin]
			
			user1 = get_user_info(msg.player1)
			v.player.name = user1.username
			v.player.sprites = window.game2Skins[user1.preferences.fighty_skin]
		}

		v.s.player1 = msg.player1
		v.s.player2 = msg.player2

		v.s.gameId = msg.game_id

		Matchmaking_setup_socket(v)
		
		document.getElementById('div-game2-area').classList.remove("hidden");
		Matchmaking_startGame2(v)
	}
}

function Matchmaking_setup_socket(v) {
	
	v.s.game_socket = new WebSocket(`wss://${window.IP}:3000/remote-players/ws/remote_access/?game_id=` + v.s.gameId);
	
	v.s.game_socket.onmessage = function(event) {
		msg = JSON.parse(event.data)
		console.log(window.user.id, " received: ", msg)
		console.log(msg.action)
		console.log(msg.action == 'ArrowUp_keydown')
		switch (msg.action) {
			case 'ArrowRight_keydown': v.keys.ArrowRight.pressed = true; v.enemy.lastKey = 'ArrowRight'; break;
			case 'ArrowRight_keyup': v.keys.ArrowRight.pressed = false; break;
			case 'ArrowLeft_keydown': v.keys.ArrowLeft.pressed = true; v.enemy.lastKey = 'ArrowLeft'; break;
			case 'ArrowLeft_keyup': v.keys.ArrowLeft.pressed = false; break;
			case 'ArrowUp_keydown': v.keys.ArrowUp.pressed = true; break;
			case 'ArrowUp_keyup': v.keys.ArrowUp.pressed = false; break;

			case 'd_keydown': v.keys.d.pressed = true; v.player.lastKey = 'd'; break;
			case 'd_keyup': v.keys.d.pressed = false; break;
			case 'a_keydown': v.keys.a.pressed = true; v.player.lastKey = 'a'; break;
			case 'a_keyup': v.keys.a.pressed = false; break;
			case 'w_keydown': v.keys.w.pressed = true; break;
			case 'w_keyup': v.keys.w.pressed = false; break;

			case 'attack_1': v.player.attack(); break;
			case 'attack_2': v.enemy.attack(); break;
		}
	}
}
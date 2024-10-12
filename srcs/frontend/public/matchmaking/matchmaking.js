function matchmaking_hashchange() {
	console.log('hashchange game2');
	window.removeEventListener('hashchange', matchmaking_hashchange)
	toast_alert('Matchmaking cancelled')
}

async function side_get_user_info(id) {
	const data = await get_user_info(id)
	console.log("Data username:", data.username);
	console.log("Data fighty_skin:", data.preferences.fighty_skin);

	return {
		username: data.username,
		skin: data.preferences.fighty_skin
	};
}


async function Matchmaking_queue(v)
{
	console.log('connecting to WebSocket')
	v.s.queue_socket = new WebSocket(`wss://${window.IP}:3000/remote-players/ws/queue/?game=Fighty&user_id=` + window.user.id);

	window.addEventListener('hashchange', matchmaking_hashchange)

	
	v.s.queue_socket.onmessage = async function(event) {
		msg = JSON.parse(event.data)
		console.log(msg)
		
		if (msg.type == 'error') 
			return ;
		
		if (window.user.id == msg.player1 ) {
			
			const user2 = await side_get_user_info(msg.player2)
			console.log('user2', user2)
			
			fighters = Matchmaking_init_fighters(
				user2.username,
				window.game2Skins[user2.skin],
				window.user.username,
				window.game2Skins[window.user.preferences.fighty_skin],
				v.g.stun_time,
			)
			
			v.player = fighters.player
			v.enemy = fighters.enemy

		} else {
			const user1 = await side_get_user_info(msg.player1)
			console.log('user1', user1)

			fighters = Matchmaking_init_fighters(
				window.user.username,
				window.game2Skins[window.user.preferences.fighty_skin],
				user1.username,
				window.game2Skins[user1.skin],
				v.g.stun_time,
			)

			v.player = fighters.player
			v.enemy = fighters.enemy
		}

		v.s.player1 = msg.player1
		v.s.player2 = msg.player2

		v.s.gameId = msg.game_id

		Matchmaking_setup_socket(v)
		
		document.getElementById('div-game2-area').classList.remove("hidden");
		Matchmaking_startGame2(v)
	}
}

function send_update(v, force = false) {

	if (force == false) {
		if (window.user.username == v.player.name && v.g.time % 2 == 0)
			return ;
		else if (window.user.username == v.enemy.name && v.g.time % 2 == 1)
			return ;
	}

	stats = {
		health_p1: v.player.health,
		health_p2: v.enemy.health,

		position_p1: v.player.position,
		position_p2: v.enemy.position,

		velocity_p1: v.player.velocity,
		velocity_p2: v.enemy.velocity,

		offset_p1: v.player.attackbox,
		offset_p2: v.enemy.attackbox,

		time: v.g.time
	}
	
	// console.log('sending game state from ' + window.user.id)
	
	v.s.game_socket.send(JSON.stringify({type: 'game_state', stats: stats}))

	return true;
}

function Matchmaking_setup_socket(v) {
	
	v.s.game_socket = new WebSocket(`wss://${window.IP}:3000/remote-players/ws/remote_access/?game_id=` + v.s.gameId);
	
	v.s.socketupdate = window.setInterval(() => {send_update(v)}, 5000)

	v.s.game_socket.onmessage = function(event) {
		msg = JSON.parse(event.data)
		console.log(window.user.id, " received: ", msg)
		console.log(msg.action)

		if (msg.type == 'move') {
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
		else if (msg.type == 'game_info') {
				if (msg.info == 'Disconenct') {
					toast_alert('Opponent disconnected')
					Matchmaking_leave_game(v)
					// todo GUARDAR NA BASE DE DADOS JA SENAO COMO WIN
				}
			}
		else if (msg.type == 'game_state')
		{
			console.log('GM from ' + window.user.id, msg)
			v.player.health = msg.stats.health_p1
			v.enemy.health = msg.stats.health_p2

			v.player.position = msg.stats.position_p1
			v.enemy.position = msg.stats.position_p2

			v.player.velocity = msg.stats.velocity_p1
			v.enemy.velocity = msg.stats.velocity_p2

			v.player.attackbox = msg.stats.offset_p1
			v.enemy.attackbox = msg.stats.offset_p2

			v.g.time = msg.stats.time
		}
	}
}
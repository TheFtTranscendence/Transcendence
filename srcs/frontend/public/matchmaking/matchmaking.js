function matchmaking_hashchange() {
	window.removeEventListener('hashchange', matchmaking_hashchange)
	toast_alert('Matchmaking cancelled')
}

async function side_get_user_info(id) {
	const data = await get_user_info(id)

	return {
		username: data.username,
		skin: data.preferences.fighty_skin
	};
}

function Matchmaking_invite(v, sender, receiver) {

	window.addEventListener('hashchange', matchmaking_hashchange)

	fighters = Matchmaking_init_fighters(
		receiver.username,
		window.game2Skins[receiver.skin],
		sender.username,
		window.game2Skins[sender.skin],
		v.g.stun_time,
	)

	


	v.player = fighters.player
	v.enemy = fighters.enemy

	v.s.player1 = sender.id
	v.s.player2 = receiver.id

	v.s.gameId = sender.game_id

	document.getElementById('div-game2-area').classList.remove("hidden");



	v.g.invite = true

	Matchmaking_setup_socket(v)
	Matchmaking_startGame2(v)
	
}

function Matchmaking_queue(v)
{
	v.s.queue_socket = new WebSocket(`wss://${window.IP}:3000/remote-players/ws/queue/?game=Fighty&user_id=` + window.user.id);

	window.addEventListener('hashchange', matchmaking_hashchange)

	
	v.s.queue_socket.onmessage = async function(event) {
		msg = JSON.parse(event.data)
		
		if (msg.type == 'error') 
			return ;
		
		if (window.user.id == msg.player1 ) {
			
			const user2 = await side_get_user_info(msg.player2)
			
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
		
		document.getElementById('div-game2-area').classList.remove("hidden");

		Matchmaking_setup_socket(v)
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
		sender: window.user.username,

		health_p1: v.player.health,
		health_p2: v.enemy.health,

		position_p1: v.player.position,
		position_p2: v.enemy.position,

		velocity_p1: v.player.velocity,
		velocity_p2: v.enemy.velocity,

		offset_p1: v.player.attackbox,
		offset_p2: v.enemy.attackbox,

		// time: v.g.time - 1
	}
	
	
	v.s.game_socket.send(JSON.stringify({type: 'game_state', stats: stats}))

	return true;
}

function Matchmaking_setup_socket(v) {
	
	v.s.game_socket = new WebSocket(`wss://${window.IP}:3000/remote-players/ws/remote_access/?game_id=` + v.s.gameId);
	
	
	v.s.game_socket.onmessage = function(event) {
		msg = JSON.parse(event.data)
		
		if (msg.type == 'ready_msg')
		{
			v.g.invite = false
			v.s.socketupdate = window.setInterval(() => {send_update(v)}, 1000)
			toast_alert('Game started!!')
			return ;
		}

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
					if (window.user.id == v.s.player1)
						v.enemy.health = 0
					else 
						v.player.health = 0
					Matchmaking_leave_game(v)
					// todo GUARDAR NA BASE DE DADOS JA SENAO COMO WIN
				}
			}
		else if (msg.type == 'game_state')
		{

			
			v.player.health = msg.stats.health_p1
			v.enemy.health = msg.stats.health_p2

			v.player.position = msg.stats.position_p1
			v.enemy.position = msg.stats.position_p2

			v.player.velocity = msg.stats.velocity_p1
			v.enemy.velocity = msg.stats.velocity_p2

			v.player.attackbox = msg.stats.offset_p1
			v.enemy.attackbox = msg.stats.offset_p2

			// v.g.time = msg.stats.time
		}

		else if (msg.type == 'game_info')
		{
			if (msg.info == 'Disconnect')
			{
				Matchmaking_leave_game(v, true)
				toast_alert("Your opponent Left")
			}
		}
		else if (msg.type == 'invite_declie')
		{
			main
		}

	}
}
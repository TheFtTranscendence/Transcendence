class MatchmakingGame	{

	/*
		On open should be something like a screen with a ready button
		If u leave it blanck the game will assume you are ready as soon as you join the game
	*/
	onopen = null;
	onready = null;
	// If u give both an onmove function and a moveset it will execute the function first and then the moveset
	onmove = null;
	moveset = null;
	oninfo = null;
	onclose = null;
	
	//todo: implement this in the backend
	ondisconnect = null;

	#performMoveSet (action)	{
		const func = this.moveset[action];

		if (func) {
			if (this.game_vars)
				return func(this.game_vars);
			else
				return func();
		}
	}

	constructor (game_id, game_vars = null, user_info = null)	{
		this.game_vars = game_vars;
		this.user_info = user_info;
		
		const url = 'https://' + window.IP + ':3000/online-games/games/' + game_id + '/';

		fetch(url, {
			method: 'GET',
		})
		.then(response => {
			return response.json();
		})
		.then((data) => {
			this.id = data.id;
			this.game_name = data.game_name;
			this.game_size = data.game_size;
			this.status = data.status;
			this.is_full = data.is_full;
			this.game_players = data.game_players;
		})
		.catch((error) => {
			throw new Error(error.message);
		});

		this.socket = new WebSocket('wss://' + window.IP + ':3000/online_games/ws/games/' + this.id + '/');

		if (this.onopen)
			this.socket.onopen = this.onopen;
		else
			this.socket.onopen = this.ready()
		
		this.socket.onmessage = function(e) {
			msg = JSON.parse(e.data)
			if (msg.type === 'GameReady' && this.onready)	{
				this.users_info = msg.users_info;
				if (this.onready)	{
					if (game_vars)
						this.onready(this.game_vars, msg.users_info);
					else
						this.onready(msg.users_info);
				}
			}	else if (msg.type === 'move' && this.onmove) {
				if (this.onmove)	{
					if (game_vars)
						this.onmove(this.game_vars, msg.sender_id, msg.action)
					else
						this.onmove(msg.sender_id, msg.action)
				}
				if (this.moveset)	{
					this.performMoveSet(msg.action, )
				}
			}	else if (msg.type === 'game_info' && this.oninfo)	{
				if (this.oninfo)	{
					if (game_vars)
						this.oninfo(this.game_vars, msg.info)
					else
						this.oninfo(msg.info)
				}
			}
		};		
	}

	postScore(score)	{
		this.socket.send(JSON.stringify({'action': 'leave', 'score': score}));
	}

	end()	{
		this.socket.close();
	}

	sendMove(move)	{
		this.socket.send(JSON.stringify({'action': 'move', 'move': move}));
	}

	sendInfo(info)	{
		this.socket.send(JSON.stringify({'action': 'game_info', 'info': info}));
	}

	ready()	{
		this.socket.send(JSON.stringify({
			action: 'ready',
			user: window.user.id,
			username: window.user.username,
			blockchain_id: window.user.blockchain_id,
			user_info: this.user_info
		}));
	}
}
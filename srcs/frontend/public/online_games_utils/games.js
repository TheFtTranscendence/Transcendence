function	joinGame(game_id, on_message_function)	{

	game_socket = new WebSocket(`wss://${window.IP}:3000/online-games/ws/games/${game_name}/${game_size}`);

	game_socket.onopen = function(e) {
		game_socket.send(JSON.stringify({
			"action": "join",
			"user": window.user.id
		}));
	};

	game_socket.onmessage = function(e)	{
		const data = JSON.parse(e.data);

		if (data.message != 'Game is ready')	{
			if (on_player_join_function || on_player_leave_function) {
				const userRegex = /user_(\w+)/;
				const match = message.match(userRegex);
				
				user_id = 0;
				if (match)
					user_id = match[1];

				if (on_player_join_function)
					on_player_join_function(user_id);
				if (on_player_leave_function)
					on_player_leave_function(user_id);
			}
		}	else	{
			on_find_function(data)
		}
	}
}
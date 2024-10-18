function joinQueue(game_name, on_find_function, on_player_join_function = null, on_player_leave_function = null, game_size = 2)	{

	queue_socket = new WebSocket(`wss://${window.IP}:3000/online-games/ws/queues/${game_name}/${game_size}/`);

	queue_socket.onopen = function(e) {
		queue_socket.send(JSON.stringify({
			"action": "join",
			"user": window.user.id
		}));
	};

	queue_socket.onmessage = function(e)	{
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
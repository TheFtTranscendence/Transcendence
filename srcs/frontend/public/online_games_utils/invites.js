/*

load_game_function = {
	game1_name = load_game_on_invites_function,
	game2_name = load_game_on_invites_function,
}

*/

function connect2GameInvites(load_game_functions, invite_response_functions = null) {
	invites_socket = new WebSocket(`wss://${window.IP}:3000/online-games/ws/invites/${window.user.id}`);

	invites_socket.onmessage = function(e)	{
		const data = JSON.parse(e.data);

		if (data.error)	{

			//todo:

		}	else	{
			switch	(data.type)	{
				case 'game_invite_message':
					//todo: create notification
					break;
				case 'invite_response_message':
					if (invite_response_functions)	{
						const func = invite_response_functions[data.game_name];
						func(data.receiver_id, data.response);
					}
					break;
				case 'game_ready_message':
					const func = load_game_functions[data.game_name];
					func(data.game_id);
					break;

			}
		}
	}
	return invites_socket;
}
class GameInvite {

	constructor (game_name, invite_id, game_size, sender_id)	{

		this.game_name = game_name;
		this.id = invite_id;
		this.game_size = game_size;
		this.sender = get_user_info(sender_id);

		//todo: add this invite to the notifications and things like that

	}

	accept () {


	}

	deny () {

	}

}

class GameInviteSocket {

	onaccept = null;
	onjoin = null;
	onreject = null;
	onready = null;

	list = [];

	constructor () {
		this.socket = new WebSocket('wss://' + window.IP + ':3000/online_games/ws/invites/' + window.user.id + '/');

		this.socket.onmessage = function (e) {
			msg = JSON.parse(e.data)

			if (msg.type == 'game_invite_message')			{
				const invite = new GameInvite(msg.game_name, msg.invite_id, msg.game_size, msg.sender_id)
				list[invite.id] = invite;
				//todo: what else do we do with this?
			} else if (msg.type == 'invite_response_message')	{
				if (msg.response == 'accept' && onaccept)			{
					onaccept(list[msg.invite_id], msg.receiver_id)
				}	else if (msg.response == 'deny' && ondeny)	{
					ondeny(list[msg.invite_id], msg.receiver_id)
				}
			} else if (msg.type == 'game_ready_message')	{
				onready(game_id)
			}
		}	
	}
	
	send(game_name, receivers, onaccept = null, onjoin = null, onreject = null, game_size = 2)	{
	
		//todo: what else do we do with this?
		window.game_invites_socket.send(JSON.stringify({
			action: "invite",
			receivers: receivers,
			game_name: game_name,
			game_size: game_size
		}))
	}

	//todo: this in the backend
	cancel(game_name, receivers, onaccept = null, onjoin = null, onreject = null, game_size = 2)	{
	
	}

}

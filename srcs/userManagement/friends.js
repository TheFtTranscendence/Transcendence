
//todo: make all received messages and sent messages uniform, some have detail, other type, some action, etc.
//* Im updating the intire user everytime there is a small update, this is obviously not the best way to do it, but it works well enought for our project
function	set_online()	{

	window.user.social_socket = new WebSocket("ws://" + window.IP + ":8000/ws/social/?token=" + window.user.token);

	//todo: also need to work with the errors
	window.user.social_socket.onmessage = function(e) {
		const data = JSON.parse(e.data);

		//todo: Make sure this are the correct and only types that u can receive
		switch (data.type) {
			case 'status':
				/**
				 * type: status
				 * user: user_id
				 * status: true/false (online status)
				 */
				update_user_info();
				//todo: Depending on how the friend list works, the way of showing if its online should update, this depends on how that works
				break ;
			case 'friend_request':
				/**
				 * type: friend_request
				 * sender: sender_id
				 */
				//todo: toast of a friend request
				//todo: Decide what else this does
				break ;
			case 'request_reponse':
				/**
				 * type: request_reponse
				 * sender: sender_id
				 * response: true/false
				 */
				if (data.response == true)	{
					update_user_info();
					//todo: toast of friend request accepted
					//? if in chat screen update chat screen because we have one more friend?
				}	else	{
					//? Do nothing?
				}
				break ;
			case 'friend_removed':
				/**
				 * type: friend_removed
				 * user: user_id
				 */
				update_user_info();
				//? if in chat screen update chat screen because we have one less friend?
				break ;
			case 'game_invite':
				/**
				 * type: 'game_invite',
				 * game: pongy/fighty,
				 * game_id: game_id,
				 * player1: player1_id,
				 * player2: player2_id,
				 */
				update_user_info();
				break ;
			case 'error':
				switch (data.detail) {
					case 'Friend Request already exists':
						// When sending a friend request
						break ;
					case 'User not found':
						/**
						 * When sending a friend request
						 * When responding to a friend request
						 * When removing a friend
						 * When sending a game invite
						 * When blocking a user
						 * When removing a block
						 */
						break ;
					case 'already friends':
						// When sending a friend request
						break ;
					case 'IDFK':
						//! This should never be the case, if this is the case its because something in the code is wrong
						//! If this appears its because a situation i did not anticipate happend
						break ;
					case 'Friend Request does not exists':
						// When responding to a friend request
						break ;
					case 'Game not found':
						//! This should also never appear, unless the user is using the console
						break ;
					case 'User already blocked':
						//! This should also not appear since they should only have the option to block someone if they are friends
						//? Are u ok with this behavior? should they be able to block anyone?
						break ;
				}
				break ;
			case 'feedback':
				switch (data.detail) {
					// When a user responds to a request, these are the messages that the sender gets
					case 'Friend request accepted':

						break;
					case 'Friend request dennied':

						break;
				}
				break;
			
		};
	}
}

// target should be an ID
function	send_friend_request(target) {
	const	data = {
		type:	"friend_request",
		target:	target

	}

	window.user.social_socket.send(data)
}

// target should be an ID
function	accept_friend_request(target) {
	const	data = {
		type:		"request_response",
		target:		target,
		response:	true
	}

	window.user.social_socket.send(data)
}

// target should be an ID
function	denie_friend_request(target) {
	const	data = {
		type:		"request_response",
		target:		target,
		response:	false
	}

	window.user.social_socket.send(data)
}

// target should be an ID
function	remove_friend(target) {
	const	data = {
		type:	"remove_friend",
		target:	target
	}

	window.user.social_socket.send(data)
}

// target should be an ID
function	block(target) {
	const	data = {
		type:	"block",
		target:	target
	}

	window.user.social_socket.send(data)
}

// target should be an ID
function	unblock(target) {
	const	data = {
		type:	"remove_block",
		target:	target
	}

	window.user.social_socket.send(data)
}

// target should be an ID
function	send_game_invite(target, game) {
	const	data = {
		type:	"game_invite",
		target:	target,
		game: game
	}

	window.user.social_socket.send(data)
}
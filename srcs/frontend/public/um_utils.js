function ping_Usermanagement() {
	return fetch(`https://${window.IP}:3000/user-management/auth/health/`, { signal: AbortSignal.timeout(5000) })
		.then(response => response.json())
		.catch(error => error);
}

function ping_Chat() {
	return fetch(`https://${window.IP}:3000/chat/health/`, { signal: AbortSignal.timeout(5000) })
		.then(response => response.json())
		.catch(error => error);
}

function ping_RemotePlayers() {
	return fetch(`https://${window.IP}:3000/remote-players/health/`, { signal: AbortSignal.timeout(5000) })
		.then(response => response.json())
		.catch(error => error);
}

function ping_Solidity() {
	return fetch(`https://${window.IP}:3000/solidity/health/`, { signal: AbortSignal.timeout(5000) })
		.then(response => response.json())
		.catch(error => error);
}

function _update_user_chats() {
	Object.entries(window.user.friend_list).forEach(([key, friend]) => {
		friend.socket = new WebSocket(`wss://${window.IP}:3000/chat/ws/chat/?user=${window.user.username}&chat_id=${friend.chat_id}`);
		
		friend.socket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			console.log(data);
		};
	});
}

function update_user_info() {
	const userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	};

	return fetch(`https://${window.IP}:3000/user-management/auth/users/`, {
		method: 'GET',
		headers: userheaders,
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.then(data => {
		window.user = data; // Access the user data
		_update_user_chats();
	})
	.catch(error => {
		throw new Error(error.message || "An unknown error occurred");
	});
}

function get_all_users() {
	const userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	};

	return fetch(`https://${window.IP}:3000/user-management/auth/users/all/`, {
		method: 'GET',
		headers: userheaders,
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.catch(error => {
		throw new Error(error.message || "An unknown error occurred");
	});
}

async function get_user_info(target) {
	const userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	};

	return fetch(`https://${window.IP}:3000/user-management/auth/users/${target}/`, {
		method: 'GET',
		headers: userheaders,
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.catch(error => {
		throw new Error(error.message || "An unknown error occurred");
	});
}

//* This is only needed as an admin on the console
//* I don't think there is a need for the user to be able to delete his account
// If no user is provided, it will delete himself
function delete_user(target = '') {
	const url = target === ''
		? `https://${window.IP}:3000/user-management/auth/users/`
		: `https://${window.IP}:3000/user-management/auth/users/${target}`;

	const userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	};

	return fetch(url, {
		method: 'DELETE',
		headers: userheaders,
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.catch(error => {
		throw new Error(error.message || "An unknown error occurred");
	});
}

//* The target part should only be used as an admin in the console, so once again, don't worry about it
function modify_user(field, new_value, target = '') {
	if (target === '') target = window.user.id;
	const url = `https://${window.IP}:3000/user-management/auth/users/${target}/`;

	const data = {
		[field]: new_value 
	};

	const userheaders = {
		'Authorization': 'Token ' + window.usertoken,
		'Content-Type': 'application/json',
	};

	return fetch(url, {
		method: 'PATCH',
		headers: userheaders,
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.catch(error => {
		throw new Error(error.message || "An unknown error occurred");
	});
}

function modify_user_preferences(field, new_value, target = '') {
    if (target === '') target = window.user.id;
    const url = `https://${window.IP}:3000/user-management/auth/users/${target}/`;

    if (field == 'pongy_skin') {
    data = {
      pongy_skin: new_value,
      fighty_skin: window.user.preferences.fighty_skin,
    }
  } else if (field == 'fighty_skin') {
    data = {
      pongy_skin: window.user.preferences.pongy_skin,
      fighty_skin: new_value,
    }
  }

    const userheaders = {
        'Authorization': 'Token ' + window.usertoken,
        'Content-Type': 'application/json',
    };

    return fetch(url, {
        method: 'PATCH',
        headers: userheaders,
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .catch(error => {
        throw new Error(error.message || "An unknown error occurred");
    });
}

function modify_user_password(old_password, password, confirm_password, target = '') {
	if (target === '') target = window.user.id;
	const url = `https://${window.IP}:3000/user-management/auth/users/${target}/`;

	const data = {
		old_password: old_password,
		password: password,
		confirm_password: confirm_password
	};

	const userheaders = {
		'Authorization': 'Token ' + window.usertoken,
		'Content-Type': 'application/json',
	};

	return fetch(url, {
		method: 'PATCH',
		headers: userheaders,
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.catch(error => {
		throw new Error(error.message || "An unknown error occurred");
	});
}

//* Im updating the entire user every time there is a small update, this is obviously not the best way to do it, but it works well enough for our project
function set_online() {
	window.social_socket = new WebSocket(`wss://${window.IP}:3000/user-management/ws/social/?user=${window.user.username}`);

	window.social_socket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		
		console.log(data);
		update_user_info();

		switch (data.type) {
			case 'status':
				/**
				 * type: status
				 * user: user_id
				 * status: true/false (online status)
				 */
				//todo: Depending on how the friend list works, the way of showing if its online should update, this depends on how that works
				//todo: this function already updates the user, it just needs to update the friend list div
				break ;
			case 'friend_request':
				/**
				 * sender = e.sender
				 * request id = e.request_id
				 * type: friend_request
				 * sender: sender_id
				 */
				user = get_user_info(data.sender)
				toast_alert(`${user.username} sent a friend request`)
				//todo: maybe this toast can have a accept and decline
				//todo: add this to the notification list
				break ;
			case 'request_reponse':
				/**
				 * response: "Friend request from ID1 to ID2 accepted/dennied"
				 * type: request_reponse
				 * sender: sender_id
				 * response: true/false
				 */
				user = get_user_info(data.sender)
				if (data.response == true)	{
					toast_alert(`You and ${user.username} are now friends`)
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
				user = get_user_info(data.user)
				toast_alert(`You and ${user.username} are no longer friends`)
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
				user = get_user_info(data.player1)
				toast_alert(`${user.username} invited you to a game of ${data.game}`)
				//todo: maybe this can go into the chat with that person
				//todo: I belive u can only send invites to friends so this would work
				break ;
			case 'error':
				switch (data.detail) {
					case 'Friend Request already exists':
						// When sending a friend request
						//? Do nothing?
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
						//? Is this all we want to do?
						toast_alert("User not found")
						break ;
					case 'already friends':
						// When sending a friend request
						//? Do nothing?
						break ;
					case 'IDFK':
						//! This should never be the case, if this is the case its because something in the code is wrong
						//! If this appears its because a situation i did not anticipate happend
						break ;
					case 'Friend Request does not exists':
						//! This should also never happen
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
						toast_alert(`You and ${user.username} are now friends`)
						break;
					case 'Friend request dennied':
						//? Do nothing
						break;
				}
				break;
			
		};
	}
}

// Target should be an ID
function send_friend_request(target) {
	const data = {
		type: "friend_request",
		target: target
	};

	window.social_socket.send(JSON.stringify(data));
}

// Target should be an ID
function accept_friend_request(target) {
	const data = {
		type: "request_response",
		target: target,
		response: true
	};

	window.social_socket.send(JSON.stringify(data));
}

// Target should be an ID
function denie_friend_request(target) {
	const data = {
		type: "request_response",
		target: target,
		response: false
	};

	window.social_socket.send(JSON.stringify(data));
}

// Target should be an ID
function remove_friend(target) {
	const data = {
		type: "remove_friend",
		target: target
	};

	window.social_socket.send(JSON.stringify(data));
}

// Target should be an ID
function block(target) {
	const data = {
		type: "block",
		target: target
	};

	window.social_socket.send(JSON.stringify(data));
}

// Target should be an ID
function unblock(target) {
	const data = {
		type: "remove_block",
		target: target
	};

	window.social_socket.send(JSON.stringify(data));
}

// Target should be an ID
function send_game_invite(target, game) {
	const data = {
		type: "game_invite",
		target: target,
		game: game
	};

	window.social_socket.send(JSON.stringify(data));
}

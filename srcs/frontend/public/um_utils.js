//! I'm assuming in this file that there is a global var called window.user

//* This is Important because of the microservices module
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

//! This is only needed as an admin on the console; don't worry about it
//! This really needs to be inside a try because if the user doesn't have an admin token, it's going to raise an exception
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

//! This really needs to be inside a try because if the target user doesn't exist, it's going to raise an exception
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

//! This really needs to be inside a try because if the target user doesn't exist, it's going to raise an exception
function get_user_info(target) {
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

		switch (data.type) {
			case 'status':
				update_user_info();
				break;
			case 'friend_request':
				// Handle friend request
				break;
			case 'request_response':
				if (data.response) {
					update_user_info();
					// Handle friend request accepted
				}
				break;
			case 'friend_removed':
				update_user_info();
				break;
			case 'game_invite':
				update_user_info();
				break;
			case 'error':
				// Handle errors
				break;
			case 'feedback':
				// Handle feedback messages
				break;
		}
	};
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

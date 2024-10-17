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

// // Target should be an ID
// function send_friend_request(target) {
// 	const data = {
// 		type: "friend_request",
// 		target: target
// 	};

// 	window.social_socket.send(JSON.stringify(data));
// }

// // Target should be an ID
// function accept_friend_request(target) {
// 	const data = {
// 		type: "request_response",
// 		target: target,
// 		response: true
// 	};

// 	window.social_socket.send(JSON.stringify(data));
// }

// // Target should be an ID
// function deny_friend_request(target) {
// 	const data = {
// 		type: "request_response",
// 		target: target,
// 		response: false
// 	};

// 	window.social_socket.send(JSON.stringify(data));
// }

// // Target should be an ID
// function remove_friend(target) {
// 	const data = {
// 		type: "remove_friend",
// 		target: target
// 	};

// 	window.social_socket.send(JSON.stringify(data));
// }

// // Target should be an ID
// function block(target) {
// 	const data = {
// 		type: "block",
// 		target: target
// 	};

// 	window.social_socket.send(JSON.stringify(data));
// }

// // Target should be an ID
// function unblock(target) {
// 	const data = {
// 		type: "remove_block",
// 		target: target
// 	};

// 	window.social_socket.send(JSON.stringify(data));
// }

// // Target should be an ID
// async function send_game_invite(target, game) {

// 	const data = {
// 		type: "game_invite",
// 		target: target,
// 		game: game
// 	};

// 	window.social_socket.send(JSON.stringify(data));
// }

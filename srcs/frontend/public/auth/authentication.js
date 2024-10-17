class SocialSocket {

	socket;

	constructor () {
		this.socket = new WebSocket(`wss://${window.IP}:3000/user-management/ws/social/?user=${window.user.username}`);

		this.socket.onmessage = async function (e) {
			const data = JSON.parse(e.data);
			
			console.log('social: '. data)
			switch (data.type) {
				case 'status':
					window.user.refresh()
					break ;
				case 'friend_request':
					new_user = await get_user_info(data.sender)
					toast_alert(`${new_user.username} sent a friend request`)
					addFriendRequest(data.sender, new_user.username)
					break ;
				case 'request_reponse':
					new_user = await get_user_info(data.sender)
					if (data.response == true)	{
						toast_alert(`You and ${new_user.username} are now friends`)
						this.addNotification(`You and ${new_user.username} are now friends`)
					}	else	{
						toast_alert(`${new_user.username} denied your friend request`)
						this.addNotification(`${new_user.username} denied your friend request`)
					}
					break ;
				case 'friend_removed':
					new_user = await get_user_info(data.user)
					toast_alert(`You and ${new_user.username} are no longer friends`)
					this.addNotification(`You and ${new_user.username} are no longer friends`)
					break ;
				case 'error':
					switch (data.detail) {
						case 'Friend Request already exists':
							toast_alert(`You already sent a friend request to this user`)
							break ;
						case 'User not found':
							toast_alert("User not found")
							break ;
						case 'already friends':
							toast_alert("You and this user are already friends")
							break ;
						case 'IDFK':
							toast_alert("Error")
							break ;
						case 'Friend Request does not exists':
							toast_alert("Error")
							break ;
						case 'Game not found':
							toast_alert("Error")
							break ;
						case 'User already blocked':
							toast_alert("Error")
							break ;
					}
					break ;
				case 'feedback':
					switch (data.detail) {
						case 'Friend request accepted':
							//! dont think there is a user here
							this.addNotification(`You and ${user.username} are now friends`)
							break;
						case 'Friend request dennied':
							break;
					}
					break;
			}
		};
	}

	sendFriendRequest(target) {
		const data = {
			type: "friend_request",
			target: target
		};
	
		this.socket.send(JSON.stringify(data));
	}

	acceptFriendRequest(target) {
		const data = {
			type: "request_response",
			target: target,
			response: true
		};
	
		this.socket.send(JSON.stringify(data));
	}
	
	denyFriendRequest(target) {
		const data = {
			type: "request_response",
			target: target,
			response: false
		};
	
		this.socket.send(JSON.stringify(data));
	}
	
	removeRriend(target) {
		const data = {
			type: "remove_friend",
			target: target
		};
	
		this.socket.send(JSON.stringify(data));
	}
	
	block(target) {
		const data = {
			type: "block",
			target: target
		};
	
		this.socket.send(JSON.stringify(data));
	}
	
	unblock(target) {
		const data = {
			type: "remove_block",
			target: target
		};
	
		this.socket.send(JSON.stringify(data));
	}

	addFriendRequest(sender_id, sender_username) {
		const tableBody = document.getElementById("notificationsTableBody");
		const newRow = document.createElement("tr");
		
		notificationText = "Friend Request from: " + sender_username
		newRow.innerHTML = `
			<td>
				<div class="notification-row">
					<span>${notificationText}</span>
					<div>
						<button class="btn btn-success btn-sm ms-2" onclick="window.user.social.acceptFriendRequest(this, '${sender_id}')">Accept</button>
						<button class="btn btn-danger btn-sm" onclick="window.user.social.declineFriendRequest(this, '${sender_id}')">Decline</button>
					</div>
				</div>
			</td>
		`;
		
		tableBody.insertBefore(newRow, tableBody.firstChild);
	}

	acceptFriendRequest(button, sender_id) {
		const buttons = button.parentElement.querySelectorAll('button');
		buttons.forEach(btn => btn.remove());
		accept_friend_request(sender_id)
	}
	
	declineFriendRequest(button, sender_id) {
		const buttons = button.parentElement.querySelectorAll('button');
		buttons.forEach(btn => btn.remove());
		deny_friend_request(sender_id)
	}

	addNotification(notificationText) {
		const tableBody = document.getElementById("notificationsTableBody");
		const newRow = document.createElement("tr");
		
		newRow.innerHTML = `
			<td>
				${notificationText}
			</td>
		`;
		
		tableBody.insertBefore(newRow, tableBody.firstChild);
	}
}

class ChatSocket {

	socket;
	onmessage;
	onopen;
	onerror;
	onclose;

	constructor () {
		this.socket = new WebSocket(`wss://${window.IP}:3000/chat/ws/chat/?user=${window.user.username}`);
	}

	refresh()	{
		Object.entries(window.user.friend_list).forEach(([key, friend]) => {
			window.chat_socket.send(JSON.stringify({
				join_chat_id: friend.chat_id
			}));
		});
	}

	set onmessage(value) {
		this.socket.onmessage = value;
	}
	set onopen(value) {
		this.socket.onopen = value;
	}
	set onerror(value) {
		this.socket.onerror = value;
	}
	set onclose(value) {
		this.socket.onclose = value;
	}

	send(data)	{
		this.socket.send(data)
	}
}

class User {
	
	#authtoken;
	id;
	email;
	username;
	blockchain_id;
	avatar;
	#isstaff;
	#issuperuser;
	friend_list;
	block_list;
	online;

	preference;

	social;
	chat;
	game_invites;


	constructor	(auth_return = null, user_cpy = null) {
		if (auth_return)	{
			this.id = auth_return.user.id;
			this.email = auth_return.user.email;
			this.username = auth_return.user.username;
			this.blockchain_id = auth_return.user.blockchain_id;
			this.avatar = auth_return.user.avatar;
			this.#isstaff = auth_return.user.staff;
			this.#issuperuser = auth_return.user.superuser;
			this.friend_list = auth_return.user.friend_list;
			this.block_list = auth_return.user.block_list;
			this.online = auth_return.user.online;
			this.preference = auth_return.user.preference;
		}	else if (user_cpy)	{
			this.id = user_cpy.id;
			this.email = user_cpy.email;
			this.username = user_cpy.username;
			this.blockchain_id = user_cpy.blockchain_id;
			this.avatar = user_cpy.avatar;
			this.#isstaff = user_cpy.staff;
			this.#issuperuser = user_cpy.superuser;
			this.friend_list = user_cpy.friend_list;
			this.block_list = user_cpy.block_list;
			this.online = user_cpy.online;
			this.preference = user_cpy.preference;
		}
		this.refresh();

		//todo:
		//this.game_invite_socket = new GameInviteSocket()
		this.social = new SocialSocket();
		this.chat = new ChatSocket();
	}


	async refresh()	{
		const userheaders = {
			'Authorization': 'Token ' + window.usertoken,
		};
	
		await fetch(`https://${window.IP}:3000/user-management/auth/users/`, {
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
			this.id = data.id;
			this.email = data.email;
			this.username = data.username;
			this.blockchain_id = data.blockchain_id;
			this.avatar = data.avatar;
			this.isstaff = data.staff;
			this.issuperuser = data.superuser;
			this.friend_list = data.friend_list;
			this.block_list = data.block_list;
			this.online = data.online;
			this.preference = data.preference;
		})
		.catch(error => {
			throw new Error(error.message || "An unknown error occurred");
		});

		this.chat.refresh()
	}

	async changeUsername(new_username)	{
		const url = `https://${window.IP}:3000/user-management/auth/users/${this.id}/`;

		const data = {
			username: new_username 
		};

		const userheaders = {
			'Authorization': 'Token ' + this.#authtoken,
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

	changePassword(old_password, new_password, confirm_new_password) {


	}

	changeAvatar(new_photo)	{

	}

	changePreference(preference, new_value)	{
		
	}

}

//todo: execptions are still not being handled
async function login(username, password)	{
	const data = {
		username: username,
		password: password,
	};

	console.log("data: ", data)

	fetch(`https://${window.IP}:3000/user-management/auth/login/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.then(data => {
		window.user = new User(data)
		localStorage.setItem('user', JSON.stringify(window.user));
		window.location.hash = "#home";
		document.getElementById('auth').classList.add('hidden');
		document.querySelector('nav').classList.remove('hidden');
	})
}

async function register(email, username, password, confirm_password)	{

	const data = {
		email: email,
		username: username,
		password: password,
		confirm_password: confirm_password,
	};

	return fetch(`https://${window.IP}:3000/user-management/auth/register/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.then(data => {
		window.user = new User(data);
		localStorage.setItem('user', JSON.stringify(window.user));
		window.location.hash = "#home";
		document.getElementById('auth').classList.add('hidden');
		document.querySelector('nav').classList.remove('hidden');
	})
	.finally(() => {
		window.isRegistering = false;
	});


}


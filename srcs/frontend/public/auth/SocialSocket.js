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
		acceptFriendRequest(sender_id)
	}
	
	declineFriendRequest(button, sender_id) {
		const buttons = button.parentElement.querySelectorAll('button');
		buttons.forEach(btn => btn.remove());
		denyFriendRequest(sender_id)
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
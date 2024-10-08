//! Im assuming in this file that there is a global var called window.user

//* This is Important because of the microservices module
function	ping_Usermanagement() {
	axios.get(`http://${window.IP}:8000/auth/health/`)
	.then((response) => {
		//todo: define a variable so it knows that the usermanagement server is up or down
	})
	.catch((error) => {
		//todo
	})
}

function	_update_user_chats() {
	Object.entries(window.user.friend_list).forEach(([key, friend]) => {
		friend.socket = new WebSocket(`ws://${window.IP}:8002/ws/chat/?user=` + window.user.username + '&chat_id=' + friend.chat_id);
	
		// todo: talk with diogo about this and how he is doing it
		// ? this should give the toast right? And then diogo changes it in the chat script
		friend.socket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			console.log(data);
		}
	})
}

//! We should still put this inside a try but it should never happen
function	update_user_info() {
	userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	}

	axios.get(`http://${window.IP}:8000/auth/users/`, {headers: userheaders})
	.then((response) => {
		window.user = response.data;
		_update_user_chats()
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

//* This is only needed as an admin on the console dont worry about it
//! This really needs to be inside a try because if the user doesnt have an admin token its going to raise an exception
function	get_all_users() {
	userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	}

	axios.get(`http://${window.IP}:8000/auth/users/all/`, {headers: userheaders})
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	});
}

//! This really needs to be inside a try because if the target user doesnt exist its going to raise an exception
//this works with both username and user ID
function	get_user_info(target) {
	userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	}

	axios.get(`http://${window.IP}:8000/auth/users/${target}/`, {headers: userheaders})
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

/*
	*This is only needed as an admin on the console
	*I dont think there is a need for the user to be able to delete his account
*/
//if no user is provided it will delete himself
function	delete_user(target = '') {
	if (target == '')	{
		url = `http://${window.IP}:8000/auth/users/`
	} else {
		url = `http://${window.IP}:8000/auth/users/${target}`
	}

	userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	}

	axios.delete(url, {headers: userheaders})
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

//* The target part should only be used as an admin in the console, so once again, dont worry about it
function	modify_user(field, new_value, target='') {
	url = `http://${window.IP}:8000/auth/users/${target}`

	data = {
		[field]: new_value
	}

	userheaders = {
		'Authorization': 'Token ' + window.usertoken,
	}

	axios.patch(url, {headers: userheaders}, data)
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}




//todo: make all received messages and sent messages uniform, some have detail, other type, some action, etc.
//* Im updating the intire user everytime there is a small update, this is obviously not the best way to do it, but it works well enought for our project
function	set_online()	{

	window.social_socket = new WebSocket("ws://" + window.IP + ":8000/ws/social/?user=" + window.user.username);

	//todo: also need to work with the errors
	window.social_socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        
        console.log(data)

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

	window.social_socket.send(data)
}

// target should be an ID
function	accept_friend_request(target) {
	const	data = {
		type:		"request_response",
		target:		target,
		response:	true
	}

	window.social_socket.send(data)
}

// target should be an ID
function	denie_friend_request(target) {
	const	data = {
		type:		"request_response",
		target:		target,
		response:	false
	}

	window.social_socket.send(data)
}

// target should be an ID
function	remove_friend(target) {
	const	data = {
		type:	"remove_friend",
		target:	target
	}

	window.social_socket.send(data)
}

// target should be an ID
function	block(target) {
	const	data = {
		type:	"block",
		target:	target
	}

	window.social_socket.send(data)
}

// target should be an ID
function	unblock(target) {
	const	data = {
		type:	"remove_block",
		target:	target
	}

	window.social_socket.send(data)
}

// target should be an ID
function	send_game_invite(target, game) {
	const	data = {
		type:	"game_invite",
		target:	target,
		game: game
	}

	window.social_socket.send(data)
}
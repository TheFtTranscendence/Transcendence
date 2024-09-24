
//todo: make all received messages and sent messages uniform, some have detail, other type, some action, etc.
//* Im updating the intire user everytime there is a small update, this is obviously not the best way to do it, but it works well enought for our project
function	set_online()	{

	window.user.social_socket = new WebSocket("ws://" + window.IP + ":8000/ws/social/?token=" + window.user.token);

	window.user.social_socket.onmessage = function(e) {
		const data = JSON.parse(e.data);

		//todo: Make sure this are the correct and only types that u can receive
		switch (data.type) {
			case 'online_message':
				update_user_info();
				//todo: Depending on how the friend list works, the way of showing if its online should update, this depends on how that works

			case 'friend_request':
				/**
				 * sender = e.sender
				 * request id = e.request_id
				 */
				//todo: toast of a friend request
				//todo: Decide what else this does

			case 'request_reponse':
				//todo: change this, it should return a bolleon
				/**
				 * response: "Friend request from ID1 to ID2 accepted/dennied"
				 */
				//! This is not how it works
				if (data.response == true)	{
					update_user_info();
					//todo: toast of friend request accepted
					//? if in chat screen update chat screen because we have one more friend?
				}

			case 'friend_removed':
				update_user_info();
				//? if in chat screen update chat screen because we have one less friend?
		};
	}
}


function	send_friend_request(target) {
	const	data = {
		action:	"friend_request",
		sender:	window.user.username,
		target:	target

	}

	window.user.social_socket.send(data)
}

function	accept_friend_request(request_id) {
	const	data = {
		action:		"respond_request",
		request_id:	request_id,
		accept:		true
	}

	window.user.social_socket.send(data)
}

function	dennie_friend_request(request_id) {
	const	data = {
		action:		"respond_request",
		request_id:	request_id,
		accept:		false
	}

	window.user.social_socket.send(data)
}

function	remove_friend(target) {
	const	data = {
		action:	"remove_friend",
		sender:	window.user.username,
		target:	target

	}

	window.user.social_socket.send(data)
}

function	block_user(target) {
	const	data = {
		action:	"block",
		sender:	window.user.username,
		target:	target

	}

	window.user.social_socket.send(data)
}

function	block_user(target) {
	const	data = {
		action:	"remove_block",
		sender:	window.user.username,
		target:	target

	}

	window.user.social_socket.send(data)
}
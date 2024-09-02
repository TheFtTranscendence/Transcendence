// Temporary
const my_id = 1
const my_token = '74563ee85ef081d312daaa79e810d55645fb402c'
const friend_requests = []

// user1 should always be the user the user that is calling the function
function getChatId(user1_id = 0 , user2_id = 0)	{
	if (user1_id == 0 || user2_id == 0)	{
		throw new Error('user_ids not provided');
	}

	const data = {
		user1_id: user1_id,
		user2_id: user2_id,
	}

	axios.post('http://localhost:8002/chats/create_chat/', data)
	.then((response) => {
		if (user1_id == response.user1_id)	{
			unread_messages = response.user1_unread_messages
		}	else	{
			unread_messages = response.user2_unread_messages
		}
		return {
			chat_id: response.data.chat_id,
			unread_messages: unread_messages
		};
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			throw error;
		}
	});
}

function joinChat(chat_id) {
	const socketUrl = `ws://localhost:8002/ws/chat/${chat_id}/`;
	const socket = new WebSocket(socketUrl);

	socket.onmessage = function(event) {
		if (event.data.sender_id == my_id)	{
			console.log('Message sent:', event.content, event.chat_id)
		}	else	{
			console.log('Message received:', event.content, event.chat_id)
			/**
			 * Add notification of a new message
			 * If the user is in chat the chat should update and not notify
			 */
		}

	};

	socket.onopen = function() {};

	socket.onclose = function(event) {
		console.log('Disconnected from the chat:', event.code, event.reason);
	};

	socket.onerror = function(error) {
		console.error('WebSocket error:', error);
	};

	return socket;
}

function getUserInfo(username)	{
	axios.get(`http://localhost:8002/users/get_info/${username}/`, data)
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			throw error;
		}
	});
}

function startChats(friend_list) {
	const chats = {}
	for (friend in friend_list) {
		user_info = getUserInfo(friend)
		chat_id = getChatId(my_id, user_info.id)
		chat_socket = joinChat(chat_id)
		chats[friend] = {
			socket: chat_socket,
			data: user_info
		}
	}
	return (chats)
}

function getOnline() {
	const socketUrl = `ws://localhost:8002/ws/friends/?token=${my_token}`
	const socket = new WebSocket(socketUrl)

	socket.onmessage = function(event) {
		if (event.type = "friend_request_received")	{
			console.log('Friend request received from ' + event.sender_id, event.request_id)
			friend_requests.push(event)
			/**
			 * notify the user that it has a friend request to respond to
			 * increase counter of friend requests
			 */
		} else if (event.detail = "User not found.")	{
			/**
			 * Don't think this can ever happen
			 */
		}
	};

	socket.onopen = function() {};

	socket.onclose = function(event) {};

	socket.onerror = function(error) {
		console.error('WebSocket error:', error);
	};

	return socket;
}

//todo change friend request to accept username and not id
function sendFriendRequest(fr_socket, target_id) {
	friend_request = {
		action: "friend_request",
		sender_id: my_id,
		target_id: target_id
	}
	fr_socket.send(friend_request)
}

function respondToFriendRequest(fr_socket, request_id, answer = false)	{
	response = {
		action: "respond_request",
		request_id: request_id,
		accept: answer
	}
	fr_socket.send(response)
	const index = friend_requests.findIndex(request => request.request_id === request_id);
    
    if (index !== -1) {
        friend_requests.splice(index, 1);
    } else {
        console.log('Request not found');
    }
}
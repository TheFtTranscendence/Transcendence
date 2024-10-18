function chat_hashchange(event) {
	// Hide the chat container
	document.getElementById("chat").classList.add("hidden")
	window.removeEventListener('hashchange', chat_hashchange)

	// Remove all event listeners before clearing the chat list container
	try {
		window.chatDivs.forEach(({ element, listener }) => {
			element.removeEventListener('click', listener)
		})
	} catch {}

	window.addButton.removeEventListener('click', chat_addButton)
	window.removeButton.removeEventListener('click', chat_removeButton)
	window.blockButton.removeEventListener('click', chat_blockButton)
	window.unblockButton.removeEventListener('click', chat_unblockButton)
	window.inviteButton1.removeEventListener('click', chat_inviteButton1)
	window.inviteButton2.removeEventListener('click', chat_inviteButton2)

	window.confirmButton.removeEventListener('click', chat_confirmButton)
	
	// Clear the chat list container's contents
	window.chatListContainer.innerHTML = ''
	window.chatContent.innerHTML = ''

	window.chatConfirmInput.value = '' // Clear input box
	window.chatInput.value = '' // Clear input box

	window.CurrentChatting_id = null;
	window.CurrentChatting = null

	window.sendButton.removeEventListener('click', sendChatMessage)
	window.removeEventListener('keypress', keypress)

	unloadScripts(window.chatScripts)
}


function sendChatMessage() {

	const newMessage = chatInput.value.trim()
	if (newMessage) {
		const messageObject = {
			chat_id: window.CurrentChatting_id,
			sender: window.user.username,
			content: newMessage
		}

		// Add the message to the database and to chat
		//   Messages.push_to_db(messageObject)
		window.Messages.push(messageObject)

		// Display the new message
		const messageDiv = document.createElement('div')
		messageDiv.classList.add('message-item', 'sent-message')
		messageDiv.innerHTML = `
		<strong>${window.user.username}:</strong> ${newMessage}
		`
		window.chatContent.appendChild(messageDiv)

		window.chat_socket.send(JSON.stringify(messageObject))

		// Clear the input box
		chatInput.value = ''
	}
}

function getMessages(friend) {
	return new Promise((resolve, reject) => {
		const url = `https://${window.IP}:3000/chat/chats/${friend[1].chat_id}/?user=${window.user.username}`;

		fetch(url, {
			method: 'GET',
		})
		.then((response) => {
			if (!response.ok) {
				return response.json().then(err => { throw err; });
			}
			return response.json();
		})
		.then((data) => {
			window.Messages = data.messages;
			resolve(data.messages); // Resolve with messages or data as needed
		})
		.catch((error) => {
			toast_alert('Error getting messages: ' + (error.message || 'An unknown error occurred.'));
			reject(error); // Pass the error to the reject
		});
	});
}


async function openChat(friend) {

	// Clear previous chat content
	window.chatContent.innerHTML = ''

	await getMessages(friend)
	window.CurrentChatting = friend[0]
	window.CurrentChatting_id = friend[1].chat_id

	window.chat_socket.onmessage = function (e) {
		
		const data = JSON.parse(e.data);
		
		if (data.chat_id == window.CurrentChatting_id)
		{
			window.Messages.push(data)
			const messageDiv = document.createElement('div')
			messageDiv.classList.add('message-item', 'received-message')
			
			messageDiv.innerHTML = `
			<strong>${data.sender}:</strong> ${data.content}
			`
			window.chatContent.appendChild(messageDiv)
			window.chatContent.scrollTop = window.chatContent.scrollHeight

		}

	}

	// Clear previous chat content
	window.chatContent.innerHTML = ''


	// Filter the messages for the selected friend
	const filteredMessages = window.Messages.filter(message => message.sender === friend[0] || message.sender === window.user.username)


	// Display the messages in the chat content div
	filteredMessages.forEach(message => {
		const messageDiv = document.createElement('div')
		messageDiv.classList.add('message-item')

		// Differentiate between sent and received messages
		if (message.sender === window.user.username) {
			messageDiv.classList.add('sent-message')
		} else {
			messageDiv.classList.add('received-message')
		}

		messageDiv.innerHTML = `
		<strong>${message.sender}:</strong> ${message.content}
		`
		window.chatContent.appendChild(messageDiv)
	})


	window.chatContent.scrollTop = window.chatContent.scrollHeight


	// Add event listener for the send button
	window.sendButton = document.getElementById('send-button')
	window.chatInput = document.getElementById('chat-input')

	window.sendButton.removeEventListener('click', sendChatMessage)
	window.sendButton.addEventListener('click', sendChatMessage)
	keypress = keypress.bind(window)
	window.removeEventListener('keydown', keypress)
	window.addEventListener('keydown', keypress)
}

function keypress(event) {
	if (event.key === 'Enter') {
		sendChatMessage()
	}
}

function displayChatList(chatListContainer, friendList) {
	window.chatDivs = []


	Object.entries(friendList).forEach(friend => {
		const chatDiv = document.createElement('div')
		chatDiv.classList.add('chat-item')

		if (friend[1].status) {
		chatDiv.innerHTML = `
			<div class="friend-name">🟢 ${friend[0]}</div>
		`
		} else {
		chatDiv.innerHTML = `
			<div class="friend-name">⚫ ${friend[0]}</div>
		`
		}

		// Add the click event listener
		const listener = () => openChat(friend)
		chatDiv.removeEventListener('click', listener)
		chatDiv.addEventListener('click', listener)
		
		// Store the chatDiv and its listener
		window.chatDivs.push({ element: chatDiv, listener })
		
		chatListContainer.appendChild(chatDiv)
	})
}

function chat_addButton() { document.getElementById('chat-input-buttons').placeholder = "add"; }
function chat_removeButton() { document.getElementById('chat-input-buttons').placeholder = "remove"; }
function chat_blockButton() { document.getElementById('chat-input-buttons').placeholder = "block"; }
function chat_unblockButton() { document.getElementById('chat-input-buttons').placeholder = "unblock"; }
function chat_inviteButton1() { document.getElementById('chat-input-buttons').placeholder = "pongy"; }
function chat_inviteButton2() { document.getElementById('chat-input-buttons').placeholder = "fighty"; }

async function chat_confirmButton() {

	const holder = document.getElementById('chat-input-buttons').placeholder
	const userInput = document.getElementById('chat-input-buttons').value
	if (userInput === '') {
		toast_alert('Enter a username')
		return
	}
	if (userInput === window.user.username) {
		toast_alert('Username is yourself')
	}
	await get_user_info(userInput).then((response) => {
		user_to_send = response.id
	}).catch((error) => {
		toast_alert('User not found', error)
		return 
	})


	switch (holder) {
		case "add": send_friend_request(user_to_send); toast_alert('Friend request sent')
			break
		case "remove": remove_friend(user_to_send); toast_alert('Friend removed')
			break
		case "block": block(user_to_send); toast_alert('User blocked')
			break
		case "unblock": unblock(user_to_send); toast_alert('User unblocked')
			break
		case "pongy": send_game_invite(user_to_send, 'pongy'); toast_alert('Pong invite sent')
			break
		case "fighty": send_game_invite(user_to_send, 'fighty'); toast_alert('Fighty invite sent')
			break
		default: toast_alert('Select an option first')
	}
}

function chat()
{

	document.getElementById("chat").classList.remove("hidden")

	window.addEventListener('hashchange', chat_hashchange)

	window.chatListContainer = document.getElementById('chat-list')
	window.chatContent = document.getElementById('chat-content')
	window.sendButton = document.getElementById('send-button')
	window.chatInput = document.getElementById('chat-input')
	window.chatDiv = document.createElement('div')

	window.addButton = document.getElementById('add-button')
	window.removeButton = document.getElementById('remove-button')
	window.blockButton = document.getElementById('block-button')
	window.unblockButton = document.getElementById('unblock-button')
	window.inviteButton1 = document.getElementById('invite-button-pong')
	window.inviteButton2 = document.getElementById('invite-button-fighters')

	window.confirmButton = document.getElementById('confirm-button')


	
	window.addButton.addEventListener('click', chat_addButton)
	window.removeButton.addEventListener('click', chat_removeButton)
	window.blockButton.addEventListener('click', chat_blockButton)
	window.unblockButton.addEventListener('click', chat_unblockButton)
	window.inviteButton1.addEventListener('click', chat_inviteButton1)
	window.inviteButton2.addEventListener('click', chat_inviteButton2)

	window.confirmButton.addEventListener('click', chat_confirmButton)

	window.chatConfirmInput = document.getElementById('chat-input-buttons')


	window.Messages = []

	try {
		friendList = window.user.friend_list
	} catch (error) {
		console.error('Error getting friend list')
		window.
		toast_alert('Error getting friend list')
		return
	}

	displayChatList(chatListContainer, friendList)
}

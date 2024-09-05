function chat_hashchange(event) {
    // Hide the chat container
    document.getElementById("chat").classList.add("hidden")
	window.removeEventListener('hashchange', chat_hashchange)

    // Remove all event listeners before clearing the chat list container
    window.chatDivs.forEach(({ element, listener }) => {
        element.removeEventListener('click', listener)
    })

    // Clear the chat list container's contents
    window.chatListContainer.innerHTML = ''
	window.chatContent.innerHTML = ''
	window.chatInput.value = '' // Clear input box
	window.sendButton.removeEventListener('click', sendChatMessage)
	window.removeEventListener('keypress', keypress)

	UnloadScripts(window.chatScripts)
}



function openChat(friendName) {
	// Clear previous chat content
    window.chatContent.innerHTML = ''
	
	
	// get message from database
	window.Messages = [	
		{ sender: 'My man Bob', msg: 'Hey, how are you?' },
		{ sender: 'You', msg: 'I\'m good, thanks! What about you?' },
		{ sender: 'My man Bob', msg: 'Doing great, just checking in. Bitch' },
	]
	
    // Filter the messages for the selected friend
    const filteredMessages = window.Messages.filter(message => message.sender === friendName || message.sender === 'You')
	
    // Display the messages in the chat content div
    filteredMessages.forEach(message => {
		const messageDiv = document.createElement('div')
        messageDiv.classList.add('message-item')
        
        // Differentiate between sent and received messages
        if (message.sender === 'You') {
			messageDiv.classList.add('sent-message')
        } else {
			messageDiv.classList.add('received-message')
        }
		
        messageDiv.innerHTML = `
		<strong>${message.sender}:</strong> ${message.msg}
        `
		
        window.chatContent.appendChild(messageDiv)
    })
	
    console.log(`Chat with ${friendName} opened`)
	
	window.chatContent.scrollTop = window.chatContent.scrollHeight
	
	
	// Add event listener for the send button
	window.sendButton = document.getElementById('send-button')
	window.chatInput = document.getElementById('chat-input')
	
	window.sendButton.addEventListener('click', sendChatMessage)
	keypress = keypress.bind(window)
	window.addEventListener('keydown', keypress)
}

function keypress(event) {
	if (event.key === 'Enter') {
		sendChatMessage()
	}
}

function sendChatMessage() {
	
	const newMessage = chatInput.value.trim()
	if (newMessage) {
		const messageObject = { sender: 'You', msg: newMessage }
		
		// Add the message to the database and to chat
		//   Messages.push_to_db(messageObject)
		window.Messages.push(messageObject)
		
		// Display the new message
		const messageDiv = document.createElement('div')
		messageDiv.classList.add('message-item', 'sent-message')
		messageDiv.innerHTML = `
		<strong>You:</strong> ${newMessage}
		`
		window.chatContent.appendChild(messageDiv)
		
		// Clear the input box
		chatInput.value = ''
		
		// Scroll to the bottom of the chat content
		window.chatContent.scrollTop = window.chatContent.scrollHeight
	}
}

function displayChatList(chatListContainer, friendList) {
	window.chatDivs = []

	Object.entries(friendList).forEach(friend => {
		const chatDiv = document.createElement('div')
		chatDiv.classList.add('chat-item')

		chatDiv.innerHTML = `
			<div class="friend-name">${friend[0]}</div>
		`

		// Add the click event listener
		const listener = () => openChat(friend.name)
		chatDiv.addEventListener('click', listener)

		// Store the chatDiv and its listener
		window.chatDivs.push({ element: chatDiv, listener })

		chatListContainer.appendChild(chatDiv)
	})
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
	
	// Get through the database when implemented
	window.Messages = []
	
	try {
		friendList = window.user.friend_list
	} catch (error) {
		console.error('Error getting friend list')
		alert('Error getting friend list')
		return
	}
	
	displayChatList(chatListContainer, friendList)
}
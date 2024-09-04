function chat_hashchange(event) {
    // Hide the chat container
    document.getElementById("chat").classList.add("hidden");
	window.removeEventListener('hashchange', chat_hashchange);

    // Remove all event listeners before clearing the chat list container
    window.chatDivs.forEach(({ element, listener }) => {
        element.removeEventListener('click', listener);
    });

    // Clear the chat list container's contents
    window.chatListContainer.innerHTML = '';
	window.chatContent.innerHTML = '';

	UnloadScripts(window.chatScripts);
}

function displayChatList(chatListContainer, friendList) {
    window.chatDivs = [];

    friendList.forEach(friend => {
        const chatDiv = document.createElement('div');
        chatDiv.classList.add('chat-item');

        chatDiv.innerHTML = `
            <div class="friend-name">${friend.name}</div>
            <div class="last-message">${friend.lastMessage}</div>
        `;

        // Add the click event listener
        const listener = () => openChat(friend.name);
        chatDiv.addEventListener('click', listener);

        // Store the chatDiv and its listener
        window.chatDivs.push({ element: chatDiv, listener });

        chatListContainer.appendChild(chatDiv);
    });
}


function openChat(friendName) {
    // Clear previous chat content
    window.chatContent.innerHTML = '';

	// Get messages from database
	const Messages = [
		{ sender: 'My man Bob', msg: 'Hey, how are you?' },
		{ sender: 'You', msg: 'I\'m good, thanks! What about you?' },
		{ sender: 'My man Bob', msg: 'Doing great, just checking in.' },
	];
	
	
    // Filter the messages for the selected friend
    const filteredMessages = Messages.filter(message => message.sender === friendName || message.sender === 'You');

    // Display the messages in the chat content div
    filteredMessages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-item');
        
        // Differentiate between sent and received messages
        if (message.sender === 'You') {
            messageDiv.classList.add('sent-message');
        } else {
            messageDiv.classList.add('received-message');
        }

        messageDiv.innerHTML = `
            <strong>${message.sender}:</strong> ${message.msg}
        `;

        window.chatContent.appendChild(messageDiv);
    });

    console.log(`Chat with ${friendName} opened`);
}

function chat()
{

	document.getElementById("chat").classList.remove("hidden");
	
	window.addEventListener('hashchange', chat_hashchange);

	window.chatListContainer = document.getElementById('chat-list');
   window.chatContent = document.getElementById('chat-content');
	window.chatDiv = document.createElement('div');

	// Get through the database when implemented
    const friendList = [
        { name: 'My man Bob', lastMessage: 'Hey, how are you?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Jonhy Wicky', lastMessage: 'Ready for the mission?' },
        { name: 'Giga minus', lastMessage: 'Let`s catch up soon!' }
	]

	displayChatList(chatListContainer, friendList);
	


}
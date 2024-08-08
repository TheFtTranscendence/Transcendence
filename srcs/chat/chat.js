function get_or_create_chat(user1_id = 0 , user2_id = 0) {
	if (user1_id == 0 || user2_id == 0)	{
		throw new Error('user_ids not provided');
	}

	const data = {
		user1_id: user1_id,
		user2_id: user2_id,
	}

	axios.post('http://${IP}:8002/chats/create_chat/', data)
	.then((response) => {
		return response.data.chat_id;
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			throw error;
		}
	});
}

function get_chat_history(chat_id = 0) {
	if (chat_id == 0)	{
		throw new Error('Error in send_messages: chat_id not provided');
	}

	axios.post('http://${IP}:8002/chats/${chat_id}/', null)
	.then((response) => {
		return response.data.messages;
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			throw error;
		}
	});

}

function send_message(chat_id = 0, sender_id = 0, content = '') {
	if (chat_id == 0)	{
		throw new Error('Error in send_messages: chat_id not provided');
	}	if (sender_id == 0)	{
		throw new Error('Error in send_messages: sender_id not provided');
	}	if (content == '')	{
		throw new Error('Error in send_messages: content not provided');
	}

	const data = {
		chat: chat_id,
		sender_id: sender_id,
		content: content,
	}

	axios.post('http://${IP}:8002/messages/', data)
	.then((response) => {
		return response.id
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			throw error;
		}
	});
}


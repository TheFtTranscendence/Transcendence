class ChatSocket {

	socket;
	onmessage;
	onopen;
	onerror;
	onclose;
	messages;

	constructor () {
		this.messages = []
		this.socket = new WebSocket(`wss://${window.IP}:3000/chat/ws/chat/?user=${window.user.username}`);
	
		this.socket.onopen = (e) => {
			console.log("IN CHAT ONOPEN")
			Object.entries(window.user.friend_list).forEach(([key, friend]) => {
				this.socket.send(JSON.stringify({
					join_chat_id: friend.chat_id
				}));
			});
		}
	}

	refresh()	{
		if (this.socket.readyState == WebSocket.OPEN)	{
			Object.entries(window.user.friend_list).forEach(([key, friend]) => {
				this.socket.send(JSON.stringify({
				join_chat_id: friend.chat_id
				}));
			});
		}
	}

	send(data)	{
		this.socket.send(data)
	}
}
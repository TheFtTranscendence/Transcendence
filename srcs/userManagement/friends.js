function	set_online()	{

	window.user.social_socket = new WebSocket("ws://" + window.IP + ":8000/ws/social/?token=" + window.user.token);

	window.user.social_socket.onmessage = function(e) {
		const data = JSON.parse(e.data);

		//todo: Make sure this are the correct and only types that u can receive
		switch (data.type) {
			case 'online_message':
				update_user_info();
				//* Depending on how the friend list works, the way of showing if its online should update, this depends on how that works

			case 'friend_request':
				//todo: toast of a friend request
				//todo: Decide what else this does

			case 'request_reponse':
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


//todo: make documentation before doing this
function	send_friend_request(target) {

	const data = {

	}

	window.user.social_socket.send()

}
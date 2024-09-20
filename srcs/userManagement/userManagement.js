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
		friend.socket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			console.log(data);
		}
	})
}

//! We should still put this inside a try but it should never happen
function	update_user_info() {
	userheaders = {
		'Authorization': 'Token ' + window.user.token,
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
		'Authorization': 'Token ' + window.user.token,
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
		'Authorization': 'Token ' + window.user.token,
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
		'Authorization': 'Token ' + window.user.token,
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
	if (target == '')	{
		url = `http://${window.IP}:8000/auth/users/`
	} else {
		url = `http://${window.IP}:8000/auth/users/${target}`
	}

	data = {
		[field]: new_value
	}

	userheaders = {
		'Authorization': 'Token ' + window.user.token,
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




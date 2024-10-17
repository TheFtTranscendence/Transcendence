class User {
	
	constructor	(auth_return) {
		this.id = auth_return.id;
		//todo: the rest
	}

	refresh()	{

	}

	changeUsername(new_username)	{

	}

	changePassword(new_password, confirm_new_password) {


	}

	changeAvatar(new_photo)	{

	}

	changePreference(preference, new_value)	{
		
	}

}

async function login(username, password)	{
	const data = {
		username: username,
		password: password,
	};

	fetch(`https://${window.IP}:3000/user-management/auth/login/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.then(data => {
		window.user = new User(data)
	})
	.catch(error => {
		//todo
	});
}

async function register(email, username, password, confirm_password)	{

	const data = {
		email: email,
		username: username,
		password: password,
		confirm_password: confirm_password,
	};

	return fetch(`https://${window.IP}:3000/user-management/auth/register/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.then(data => {
		window.user = new User(data)

	})
	.catch(error => {
		//todo:
	})
	.finally(() => {
		window.isRegistering = false;
	});


}


class User {
	
	authtoken;
	id;
	email;
	username;
	blockchain_id;
	avatar;
	#isstaff;
	#issuperuser;
	friend_list;
	block_list;
	online;

	preference;

	social;
	chat;
	game_invites;


	constructor	(auth_return = null, user_cpy = null) {
		if (auth_return)	{
			this.id = auth_return.user.id;
			this.email = auth_return.user.email;
			this.username = auth_return.user.username;
			this.blockchain_id = auth_return.user.blockchain_id;
			this.avatar = auth_return.user.avatar;
			this.#isstaff = auth_return.user.staff;
			this.#issuperuser = auth_return.user.superuser;
			this.friend_list = auth_return.user.friend_list;
			this.block_list = auth_return.user.block_list;
			this.online = auth_return.user.online;
			this.preference = auth_return.user.preference;
			this.authtoken = auth_return.token;
		}	else if (user_cpy)	{
			this.id = user_cpy.id;
			this.email = user_cpy.email;
			this.username = user_cpy.username;
			this.blockchain_id = user_cpy.blockchain_id;
			this.avatar = user_cpy.avatar;
			this.#isstaff = user_cpy.staff;
			this.#issuperuser = user_cpy.superuser;
			this.friend_list = user_cpy.friend_list;
			this.block_list = user_cpy.block_list;
			this.online = user_cpy.online;
			this.preference = user_cpy.preference;
			this.authtoken = user_cpy.authtoken
		}

		this.social = null;
		this.chat = null;
		this.game_invites = null;
	}
	
	async init() {
		console.info("USERNAME: ", this.username);
		
        this.social = new SocialSocket();
        this.chat = new ChatSocket();
		
		//? what is this?
		if (window.frontendHealthCheck === false) 
		{
			window.frontendHealthCheck = true
			checkTournamentStatus()
		}

		await this.refresh(true);
    }


	async refresh(init = false)	{
		if (window.user.authtoken)	{
			const userheaders = {
				'Authorization': 'Token ' + window.user.authtoken,
			};
		
			await fetch(`https://${window.IP}:3000/user-management/auth/users/`, {
				method: 'GET',
				headers: userheaders,
			})
			.then(response => {
				if (!response.ok) {
					return response.json().then(err => { throw err; });
				}
				return response.json();
			})
			.then(data => {
				this.id = data.id;
				this.email = data.email;
				this.username = data.username;
				this.blockchain_id = data.blockchain_id;
				this.avatar = data.avatar;
				this.isstaff = data.staff;
				this.issuperuser = data.superuser;
				this.friend_list = data.friend_list;
				this.block_list = data.block_list;
				this.online = data.online;
				this.preference = data.preference;
			})
			.catch(error => {
				throw new Error(error.message);
			});

			if (init)	{
				console.log("IN USER REFRESH")
				this.chat.refresh()
			}
		}	else	{
			console.log("This is stupid...")
			this.refresh();
		}
	}

	async changeUsername(new_username)	{
		const url = `https://${window.IP}:3000/user-management/auth/users/${this.id}/`;

		const data = {
			username: new_username 
		};

		const userheaders = {
			'Authorization': 'Token ' + this.authtoken,
			'Content-Type': 'application/json',
		};

		return fetch(url, {
			method: 'PATCH',
			headers: userheaders,
			body: JSON.stringify(data),
		})
		.then(response => {
			if (!response.ok) {
				return response.json().then(err => { throw err; });
			}
			return response.json();
		})
		.catch(error => {
			throw new Error(error.message || "An unknown error occurred");
		});
	}

	changePassword(old_password, new_password, confirm_new_password) {


	}

	async changeAvatar(file)	{
		const data = {
			avatar: file,
		}
	
		try {
			const response = await fetch(`https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`, {
				method: 'PATCH',
				body: JSON.stringify(data),
				headers: {
					'Authorization': 'Token ' + window.user.authtoken,
				},
			});
	
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Network response was not ok');
			}
	
			const data = await response.json();
			console.log('Avatar uploaded successfully:', data);
		} catch (error) {
			console.error('Error uploading avatar:', error);
		}
		this.refresh()
	}

	changePreference(preference, new_value)	{
		
	}

	cleanup()	{
		this.social.cleanup();
		this.chat.cleanup();
		this.game_invites.cleanup();
		localStorage.setItem('user', JSON.stringify(window.user));
	}

}

//todo: execptions are still not being handled
async function login(username, password)	{
	const data = {
		username: username,
		password: password,
	};

	console.log("data: ", data)

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
		window.user.init()
		localStorage.setItem('user', JSON.stringify(window.user));
		window.location.hash = "#home";
		document.getElementById('auth').classList.add('hidden');
		document.querySelector('nav').classList.remove('hidden');
	})
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
		window.user = new User(data);
		window.user.init()
		localStorage.setItem('user', JSON.stringify(window.user));
		window.location.hash = "#home";
		document.getElementById('auth').classList.add('hidden');
		document.querySelector('nav').classList.remove('hidden');
	})
	.finally(() => {
		window.isRegistering = false;
	});


}

function auth_hashchange(event)
{
	document.getElementById('auth').classList.add('hidden');
	unloadScripts(window.authScripts);
}

function auth()
{
	document.querySelector('nav').classList.add('hidden');
	const userJSON = localStorage.getItem('currentUser');
	const currentUserLS = userJSON ? JSON.parse(userJSON) : null;

	if (currentUserLS) {
		currentUser.name = currentUserLS.username
		console.log(`Welcome back, ${currentUserLS.username}`);
		window.location.hash = '#home';
		document.getElementById('auth').classList.add('hidden');
		unloadScripts(window.authScripts);
	} else {
		console.log('No user is currently logged in.');
		window.location.hash = '#auth';
	}
	document.getElementById('auth').classList.remove('hidden');
	window.addEventListener('hashchange', auth_hashchange);
}

function handleSuccessAuth(errorField) {
	console.log("handleSuccessAuth() called")
	document.getElementById('auth').classList.add('hidden');
	document.querySelector('nav').classList.remove('hidden');
	window.location.hash = '#home';
	if (!errorField.classList.contains('hidden'))
		errorField.classList.add('hidden');

	userheaders = {
		'Authorization': 'Token ' + window.Usertoken,
	}

	axios.get('http://' + window.IP + ':8000/auth/users/', {headers: userheaders})
	.then((response) => {
		window.user = response.data;
		console.log('User:', window.user);
		console.log(response.data);

		Object.entries(window.user.friend_list).forEach(([key, friend]) => {
			// Create a WebSocket connection for each friend
			friend.socket = new WebSocket('ws://' + window.IP + ':8002/ws/chat/?user=' + window.user.username + '&chat_id=' + friend.chat_id);

			// Setup an onmessage event listener
			friend.socket.onmessage = function(e) {
				const data = JSON.parse(e.data);
				console.log(data);
			};

			console.log('Friend key:', key);
			console.log('Friend object:', friend);
		});

	})
	.catch((error) => {
		console.error(error);
	});

	currentUser.username = window.user.username;
	localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function handleLogin() {
	const username = document.getElementById('loginUsername').value;
	const password = document.getElementById('loginPassword').value;
	const errorField = document.getElementById('loginError')

	const data = {
		username: username,
		password: password,
	}

	axios.post('http://' + window.IP + ':8000/auth/login/', data)
	.then((response) => {
		window.Usertoken = response.data.token;
		console.log(response.data);
		handleSuccessAuth(errorField);
		alert('Login successful');
	})
	.catch((error) => {
		var errorMsg = error;
		if (error.response)	{
			const status = error.response.status;
			const missing_fields = error.response.data.missing_fields;

			if (status === 400 && missing_fields) {
				if (missing_fields.includes('username')) {
					errorMsg = "Username is required"
				}
				if (missing_fields.includes('password')) {
					errorMsg = "Password is required";
				}
			} else {
				//errorMsg = error.response.json().message;
			}
		}
		errorField.textContent = errorMsg;
		errorField.classList.remove('hidden');
		handleSuccessAuth(errorField, username);
	})
}

function handleRegister() {
	const username = document.getElementById('registerUsername').value;
	const password = document.getElementById('registerPassword').value;
	const confirm_password = document.getElementById('registerPasswordConfirm').value;
	const email = document.getElementById('registerEmail').value;
	const errorField = document.getElementById('registerError')

	const data = {
		email: email,
		username: username,
		password: password,
		confirm_password: confirm_password
	}

	axios.post('http://' + window.IP + ':8000/auth/register/', data)
	.then((response) => {
		console.log(response.data);
		alert('Registration successful');
		handleSuccessAuth(errorField, data.username)
	})
	.catch((error) => {
		var errorMsg = error;
		if (error.response)	{
			const status = error.response.status;
			const missing_fields = error.response.data.missing_fields;

			if (status === 400 && missing_fields) {
				if (missing_fields.includes('username')) {
					errorMsg = "Username is required";
				}
				if (missing_fields.includes('password')) {
					errorMsg = "Password is required";
				}
				if (missing_fields.includes('email')) {
					errorMsg = "Email is required";
				}
				if (missing_fields.includes('first_name')) {
					errorMsg = "First name is required";
				}
				if (missing_fields.includes('last_name')) {
					errorMsg = "Last name is required";
				}
			} else if (status === 409) {
				errorMsg = "Username already exists";
			} else {
				errorMsg = "An error occurred: ' + error.response.data.message";
				errorMsg = "An error occurred: ' + error.response.message";
			}
		}
		errorField.textContent = errorMsg;
		errorField.classList.remove('hidden');
	})
}

// Handle login and register forms
document.getElementById('loginForm').addEventListener('submit', (event) => {
	event.preventDefault();
	handleLogin()
});

document.getElementById('registerForm').addEventListener('submit', (event) => {
	event.preventDefault();
	handleRegister()
});


//AUTH ANIMATION

const leftSide = document.querySelector('.left-side');
const rightSide = document.querySelector('.right-side');
const rightContent = document.querySelector('.right-content');
const leftContent = document.querySelector('.left-content');
const leftForm = document.getElementById('login')
const rightForm = document.getElementById('register')

function handleClick(expandedSide, collapsedSide, expandedContent, collapsedContent, expandedForm, collapsedForm) {
	collapsedSide.classList.remove('col-sm-6', 'col-sm-10');
	collapsedContent.classList.add('hidden');
	collapsedSide.classList.add('col-sm-2');
	collapsedForm.classList.add('hidden');

	expandedSide.classList.remove('col-sm-2', 'col-sm-6');
	expandedSide.classList.add('col-sm-10');
	expandedContent.classList.remove('hidden');
	expandedForm.classList.remove('hidden');

}

leftSide.addEventListener('click', () => {
	handleClick(leftSide, rightSide, leftContent, rightContent, leftForm, rightForm);
});

rightSide.addEventListener('click', () => {
	handleClick(rightSide, leftSide, rightContent, leftContent, rightForm, leftForm);
});

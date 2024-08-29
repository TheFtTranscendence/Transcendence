
window.authScripts = [
	'auth/init.js'
]

window.chatScripts = [
	'chat/chat.js',
];

window.homeScripts = [
	'home/init.js',
];

window.gameScripts = [
	'game/gameScript.js',
];

window.game2Scripts = [
	'game2/before_game.js',
	'game2/classes.js',
	'game2/events.js',
	'game2/init.js',
	'game2/game_end.js',
	'game2/gameScript2.js'
];

navigate();

// Function to handle navigation
function navigate() {
	console.log("navigate() called")
	let element, scripts, startFunction;

	if (!window.location.hash) {
		console.log("set hash to auth")
        window.location.hash = '#auth';
    }

	switch (window.location.hash) {

		case '#auth':
			element = 'auth'
			scripts = window.authScripts
			startFunction = 'auth'
			break;


		case '#home':
			element = 'home'
			scripts = window.homeScripts
			startFunction = 'home'
			break;

		case '#game':
			element = 'game'
			scripts = window.gameScripts
			startFunction = 'startGame'
			break

		case '#game2':
			element = 'game2'
			scripts = window.game2Scripts
			startFunction = 'before_game'
			break

		case '#chat':
			element = 'chat'
			scripts = window.chatScripts
			startFunction = 'chat'
			break
	}

	document.getElementById(element).classList.remove("hidden");
	loadScripts(scripts, startFunction);
}

// Function to load a script and return a Promise
function loadScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = src;
		script.type = 'text/javascript';

		script.onload = () => {
			resolve();
		};

		script.onerror = () => {
			reject(new Error(`Failed to load script: ${src}`));
		};

		document.body.appendChild(script);
	});
}

// Function to load all scripts
function loadScripts(scripts, functionName) {

	scripts.reduce((promise, src) => {

		return promise.then(() => loadScript(src));
	}, Promise.resolve())
	.then(() => {

		switch(functionName) {
			case 'auth' : auth(); break;
			case 'before_game': before_game(); break;
			case 'startGame': startGame(); break;
			case 'home': home(); break;
			case 'chat': chat(); break;
			default: console.error("Function " + functionName + " not found");
		}

	})
	.catch(error => {
		console.error(error);
	});
}

function unloadScripts(scripts) {

	scripts.forEach(script => {
		const scriptElement = document.querySelector(`script[src="${script}"]`);
		if (scriptElement) {
			scriptElement.remove();
		}
	});
}


function loadGameScript()
{
	const script = document.createElement('script');
	script.src = 'game/gameScript.js';
	script.type = 'text/javascript';

	script.onload = function() {
		if (typeof startGame === 'function') {
			startGame();
		} else {
			console.error("startGame function not found");
		}
	};

	// if (typeof startGame === 'function')
	//     startGame();
	document.body.appendChild(script);
}

function handleSuccessAuth(errorField, username) {
	setTimeout(() => {
		window.location.hash = '#home';
	}, 100);
	console.log("handleSuccessAuth() called")
	document.getElementById('auth').classList.add('hidden');
	document.querySelector('nav').classList.remove('hidden');
	window.location.hash = '#home';
	if (!errorField.classList.contains('hidden'))
		errorField.classList.add('hidden');
	//currentUser.username = username;
	//localStorage.setItem('currentUser', JSON.stringify(currentUser));
	axios.get('http://localhost:8000/auth/user_info/' + username + '/')
	.then((response) => {
		window.user = response.data;
		console.log('Users:', window.user);
	})
	.catch((error) => {
		console.error(error);
	});
}

function handleLogin() {
	const username = document.getElementById('loginUsername').value;
	const password = document.getElementById('loginPassword').value;
	const errorField = document.getElementById('loginError')

	const data = {
		username: username,
		password: password,
	}

	axios.post('http://localhost:8000/auth/login/', data)
	.then((response) => {
		console.log(response.data);
		handleSuccessAuth(errorField, username);
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
	const first_name = document.getElementById('registerFirstName').value;
	const last_name = document.getElementById('registerLastName').value;
	const errorField = document.getElementById('registerError')

	const data = {
		email: email,
		username: username,
		password: password,
		confirm_password: confirm_password
	}

	axios.post('http://localhost:8000/auth/register/', data)
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

// Optional: Adding click event listeners to navigation links (not necessary if links have hrefs with hashes)
document.querySelectorAll('.nav-link').forEach(link => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		window.location.hash = link.getAttribute('href');
	});
});


//AUTH ANIMATION
document.addEventListener('DOMContentLoaded', () => {
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
})



// Event listener for hash changes
window.addEventListener('hashchange', navigate);


// Open a WebSocket connection
const socket = new WebSocket('ws://localhost:8000/ws/friends/');

// Listen for messages from the server
socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.type === 'friend_request_received') {
        console.log('Friend request received from user ID:', data.sender_id);
        // Handle displaying the friend request in your UI
    } else {
        console.log(data.detail);
    }
};

// Send a friend request
function sendFriendRequest(friendId) {
    socket.send(JSON.stringify({
        action: 'send_request',
        friend_id: friendId
    }));
}

// Respond to a friend request
function respondToRequest(requestId, accept) {
    socket.send(JSON.stringify({
        action: 'respond_request',
        request_id: requestId,
        accept: accept
    }));
}

// Add a friend (directly, if needed)
function addFriend(friendId) {
    socket.send(JSON.stringify({
        action: 'add_friend',
        friend_id: friendId
    }));
}

// Remove a friend (directly, if needed)
function removeFriend(friendId) {
    socket.send(JSON.stringify({
        action: 'remove_friend',
        friend_id: friendId
    }));
}


navigate();

// Function to handle navigation
function navigate() {
	let element, scripts, startFunction;

	if (!window.location.hash) {
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

		case '#pongy':
			element = 'games'
			scripts = window.menuScripts
			startFunction = 'main_menu'
			break;

		case '#fighters':
			element = 'games'
			scripts = window.menuScripts
			startFunction = 'main_menu'
			break;

		case '#chat':
			element = 'chat'
			scripts = window.chatScripts
			startFunction = 'chat'
			break;
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
function loadScripts(scripts, functionName = 'none') {

	scripts.reduce((promise, src) => {

		return promise.then(() => loadScript(src));
	}, Promise.resolve())
	.then(() => {
		if (functionName != 'none') {
			if (typeof window[functionName] === 'function') {
				window[functionName]();
						} else {
				console.error("Function " + functionName + " not found");
			}
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


function handleLogin() {
	const username = document.getElementById('loginUsername').value;
	const password = document.getElementById('loginPassword').value;

	const data = {
		username: username,
		password: password,
	}

	// console.log('Sending JSON:', JSON.stringify(data, null, 2));
	
	axios.post(`http://${window.IP}:8000/auth/login/`, data)
	.then((response) => {
		console.log(response.data);
		alert('Login successful');
		
		window.Usertoken = response.data.token;
		
		userheaders = {
			'Authorization': 'Token ' + response.data.token,
		}

		axios.get(`http://${window.IP}:8000/auth/users/`, {headers: userheaders})
		.then((response) => {
			window.user = response.data;
			console.log('User:', window.user);
			console.log(response.data);

			Object.entries(window.user.friend_list).forEach(([key, friend]) => {
				// Create a WebSocket connection for each friend
				friend.socket = new WebSocket(`ws://${window.IP}:8002/ws/chat/?user=` + window.user.username + '&chat_id=' + friend.chat_id);
			
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
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			const status = error.response.status;
			const missing_fields = error.response.data.missing_fields;

			if (status === 400 && missing_fields) {
				if (missing_fields.includes('username')) {
					console.log('Username is required.');
				}
				if (missing_fields.includes('password')) {
					console.log('Password is required.');
				}
			} else {
				console.log('An error occurred: ' + error.response.json().message);
			}
		}
	});


}

function handleRegister() {
	const username = document.getElementById('registerUsername').value;
	const password = document.getElementById('registerPassword').value;
	const email = document.getElementById('registerEmail').value;
	const first_name = document.getElementById('registerFirstName').value;
	const last_name = document.getElementById('registerLastName').value;

	const data = {
		username: username,
		password: password,
		email: email,
		first_name: first_name,
		last_name: last_name,
	}

	// console.log('Sending JSON:', JSON.stringify(data, null, 2));

	axios.post(`http://${window.IP}:8000/auth/register/`, data)
	.then((response) => {
		console.log(response.data);
		alert('Registration successful');
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			const status = error.response.status;
			const missing_fields = error.response.data.missing_fields;

			if (status === 400 && missing_fields) {
				if (missing_fields.includes('username')) {
					console.log('Username is required.');
				}
				if (missing_fields.includes('password')) {
					console.log('Password is required.');
				}
				if (missing_fields.includes('email')) {
					console.log('Email is required.');
				}
				if (missing_fields.includes('first_name')) {
					console.log('First name is required.');
				}
				if (missing_fields.includes('last_name')) {
					console.log('Last name is required.');
				}
			} else if (status === 409) {
				console.log('Username already exists');
			} else {
				console.log('An error occurred: ' + error.response.data.message);
				console.log('An error occurred: ' + error.response.message);
			}
		}
	});
}

// Handle login and register forms
document.getElementById('loginForm').addEventListener('submit', (event) => {
	event.preventDefault();

	handleLogin();
	
	document.getElementById('auth').classList.add('hidden');
	document.querySelector('nav').classList.remove('hidden');
	window.location.hash = '#home';
	navigate();
});

document.getElementById('registerForm').addEventListener('submit', (event) => {
	event.preventDefault();

	handleRegister();

	document.getElementById('auth').classList.add('hidden');
	document.querySelector('nav').classList.remove('hidden');
	window.location.hash = '#home';
	navigate();
});

// // Show the appropriate auth page (login or register)
// function showAuthPage(page) {
//     document.querySelectorAll('.auth-page').forEach(el => el.classList.add('hidden'));
//     document.getElementById(page).classList.remove('hidden');
// }

//     document.getElementById('toRegister').addEventListener('click', () => {
//         showAuthPage('register');
//     });

//     document.getElementById('toLogin').addEventListener('click', () => {
//         showAuthPage('login');
//     });
// }

// // Initial page load
// window.addEventListener('load', () => {
//     // Show login page initially
//     showAuthPage('login');
//     handleAuthForms();
// });

// Event listener for hash changes
window.addEventListener('hashchange', navigate);

// Optional: Adding click event listeners to navigation links (not necessary if links have hrefs with hashes)
document.querySelectorAll('.nav-link').forEach(link => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		window.location.hash = link.getAttribute('href');
	});
});


// Event listener for hash changes
window.addEventListener('hashchange', navigate);

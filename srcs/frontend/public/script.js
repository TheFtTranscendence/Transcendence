// Sample content for each route
const routes = {
	'#home': `<h1>Home Page</h1><p>Welcome to the home page!</p>`,
	'#game': `<h1>Game</h1><canvas id="game-area"></canvas>`,
	'#game2': `<h1>Game2</h1>
					<div id="div-game2-area">
						<div id="div-game2-top">
							<!-- Player 1 health -->
							<div id="game2-bar1-parent">
								<div id="game2-bar1-background"></div>
								<div id="game2-bar1"></div>
							</div>
							<!-- timer -->
							<div id="game2-timer"> 50 </div>
							<!-- Player 2 health -->
							<div id="game2-bar2-parent">
								<div id="game2-bar2-background"></div>
								<div id="game2-bar2"></div>
							</div>
						</div>
						<div id= "game2-end-text"> Tie </div>
						<div>
							<canvas id="game2-area"></canvas>
						</div>
					</div>
					`,
	'#chat': `<h1>Chat</h1><p>Here can be eventually the chat</p>`
};
				

// Function to handle navigation
function navigate() {
	const hash = window.location.hash;
	const contentDiv = document.getElementById('content');
	contentDiv.innerHTML = routes[hash] || '<h1>404 Not Found</h1><p>Page not found.</p>';

	if (hash === '#game')
		loadGameScript();
	if (hash === '#game2')
		loadGameScript2();
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
function loadGameScript2() {
	scripts = [
		'game2/events.js',
		'game2/init.js',
		'game2/game_end.js',
		'game2/gameScript2.js'
	];
	
	scripts.reduce((promise, src) => {
		
		return promise.then(() => loadScript(src));
	}, Promise.resolve()).then(() => {

		if (typeof startGame2 === 'function')
			startGame2();
		else
			console.error("startGame2 function not found")

	}).catch(error => {
		console.error(error);
	});
}

// Starts game script
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

	axios.post('http://localhost:8000/auth/login/', data)
	.then((response) => {
		console.log(response.data);
		alert('Login successful');
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

	axios.post('http://localhost:8000/auth/register/', data)
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
		console.log("Left side clicked");
		handleClick(leftSide, rightSide, leftContent, rightContent, leftForm, rightForm);
	});

	rightSide.addEventListener('click', () => {
		console.log("Right side clicked");
		handleClick(rightSide, leftSide, rightContent, leftContent, rightForm, leftForm);
	});
})








function get_or_create_chat(user1_id = 0 , user2_id = 0) {
	if (user1_id == 0 || user2_id == 0)	{
		throw new Error('user_ids not provided');
	}

	const data = {
		user1_id: user1_id,
		user2_id: user2_id,
	}

	axios.post('http://localhost:8002/chats/create_chat/', data)
	.then((response) => {
		chat_id = response.data.id;
		console.log(chat_id);
		return {
			chat_id: response.data.id,
			chat_ws: new WebSocket('ws://localhost:8002/ws/chat/' + response.data.id + '/'),
		};
	})
	.catch((error) => {
		console.error(error);
		if (error.response)	{
			throw error;
		}localhost
	});
}

function get_chat_history(chat_id = 0) {
	if (chat_id == 0)	{
		throw new Error('Error in send_messages: chat_id not provided');
	}

	axios.get(`http://localhost:8002/chats/${chat_id}/`, null)
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

	axios.post(`http://localhost:8002/messages/`, data)
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


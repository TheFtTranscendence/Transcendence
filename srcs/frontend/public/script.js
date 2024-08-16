// Sample content for each route
const routes = {
	'#home': `<h1>Home Page</h1><p>Welcome to the home page!</p>`,
	'#game': `<h1>Game</h1><canvas id="game-area"></canvas>`,
	'#game2': `
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
	'#chat': `
<div id="chat-main-div">
        <div id="chat-left-parent">
            <div id="chat-contacts-history">
                <h2>Chat History</h2>
                <ul class="chat-list">
                    <li class="chat-item">Chat 1</li>
                    <li class="chat-item">Chat 2</li>
                    <li class="chat-item">Chat 3</li>
                    <!-- Add more chats as needed -->
                </ul>
            </div>
        </div>

        <div id="chat-right-parent">
            <button id="toggle-friend-list" onclick="toggleFriendList()">Friends</button>

            <div id="chat-friend-div">
                <h2>Friends</h2>
                <ul>
                    <li class="friend-item">Friend 1</li>
                    <li class="friend-item">Friend 2</li>
                    <li class="friend-item">Friend 3</li>
                    <!-- Add more friends as needed -->
                </ul>
            </div>

            <div id="chat-right-top">
                <h2>Messages</h2>
                <div class="message">Hello, how are you?</div>
                <div class="message">I'm fine, thanks!</div>
                <!-- Add more messages as needed -->
            </div>

            <div id="chat-right-bottom">
                <!-- This can be used for message input or additional controls -->
                <textarea placeholder="Type a message..."></textarea>
            </div>
        </div>
    </div>
`
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
	if (hash === '#chat')
		loadChatScript();
}

function loadChatScript() {
	const script = document.createElement('script');
	script.src = 'chat/chat.js';
	script.type = 'text/javascript';

	document.body.appendChild(script);
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
		'game2/before_game.js',
		'game2/events.js',
		'game2/init.js',
		'game2/game_end.js',
		'game2/gameScript2.js'
	];
	
	scripts.reduce((promise, src) => {
		
		return promise.then(() => loadScript(src));
	}, Promise.resolve()).then(() => {

		if (typeof before_game === 'function')
			before_game();
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

		axios.get('http://localhost:8000/auth/users/' + username + '/')
		.then((response) => {
			window.user = response.data;
			console.log('User:', window.user);
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


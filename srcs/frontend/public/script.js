
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


// Optional: Adding click event listeners to navigation links (not necessary if links have hrefs with hashes)
document.querySelectorAll('.nav-link').forEach(link => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		window.location.hash = link.getAttribute('href');
	});
});


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


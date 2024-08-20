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

	if (hash === '#home')
		getAvater('esali');
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
	const errorField = document.getElementById('loginError')

	const data = {
		username: username,
		password: password,
	}

	axios.post('http://localhost:8000/auth/login/', data)
	.then((response) => {
		console.log(response.data);
		alert('Login successful');
		return true;
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
				errorMsg = "An error occurred: " + error.response.json().message;
			}
		}
		errorField.textContent = errorMsg;
		errorField.classList.remove('hidden');
		return false;
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
		return true;
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
		return false;
	})
}

function getAvater(username) {
	const imgElement = document.querySelector('#profile-img img');
	axios.get('http://localhost:8000/data/avatar/' + username)
    .then((response) => {
		const imageUrl = response.data.url;
		imgElement.src = imageUrl;
		// TODO: Check if imnageUrl is working and show default if not
    })
    .catch((error) => {
        console.error(error);
		imgElement.src = 'img/red.jpg';
    });
	document.getElementById('profile-img').classList.remove('hidden');
}

// Handle login and register forms
document.getElementById('loginForm').addEventListener('submit', (event) => {
	event.preventDefault();
	if (handleLogin()) {
		document.getElementById('auth').classList.add('hidden');
		document.querySelector('nav').classList.remove('hidden');
		window.location.hash = '#home';
		navigate();
	}
});

document.getElementById('registerForm').addEventListener('submit', (event) => {
	event.preventDefault();
	if (handleRegister()) {
		document.getElementById('auth').classList.add('hidden');
		document.querySelector('nav').classList.remove('hidden');
		window.location.hash = '#home';
		navigate();
	}
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


// document.addEventListener('click', function(event) {
//     const sidebar = document.getElementById('sidebar');
//     const isClickInsideSidebar = sidebar.contains(event.target);
// 	const isClickProfile = document.getElementById('profile-img').contains(event.target);

//     if (!isClickInsideSidebar && !isClickProfile) {
//         // Hide the sidebar when clicking outside of it
// 		console.log("not inside")
//         sidebar.classList.add('hidden');
//     }
// 	else {
// 		console.log("inside")
// 	}
// });


function showSideBar() {
	//event.stopPropagation();
	document.getElementById('sidebar').classList.toggle('hidden');
	document.addEventListener('click', handleOutsideClick);
}

function handleOutsideClick(event) {
    const sidebar = document.getElementById('sidebar');
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickProfile = document.getElementById('profile-img').contains(event.target);

    if (!isClickInsideSidebar && !isClickProfile) {
        console.log("Clicked outside, hiding sidebar");
        sidebar.classList.add('hidden');
        document.removeEventListener('click', handleOutsideClick);
    } else {
        console.log("Clicked inside sidebar or profile image");
    }
}

// Function to handle logout
function handleLogout() {
	alert('Logging out...');
	// ToDo: Logout operations
	window.location.hash = '#home';
	navigate();
}

// Function to handle profile update
function handleProfileUpdate() {
	alert('Updating profile...');
	// ToDo
}

// Event listener for hash changes
window.addEventListener('hashchange', navigate);

// Toggle sidebar on menu icon click
document.getElementById('profile-img').addEventListener('click', showSideBar);

function putAvater() {
	var loadFile = function(event) {
		var image = document.querySelector('#profile-img img');
		image.src = URL.createObjectURL(event.target.files[0]);
	};
}

document.getElementById('changeProfilePicture').addEventListener('change', putAvater);

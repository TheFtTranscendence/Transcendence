// window.onload = function() {
// 	// Set the hash to #auth when the page loads
// 	window.location.hash = '#auth';
// };

navigate();
// Function to handle navigation
function navigate() {
	let element, scripts, startFunction;

	if (window.user == undefined) 
		window.location.hash = '#auth';

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
	if (element === "games")
		unloadScripts(scripts)
	loadScripts(scripts, startFunction);
}


async function loadScript(src) {
    // Check if the script is already loaded
    const scriptElement = document.querySelector(`script[src="${src}"]`);
    console.log("Script element -> ", scriptElement);
    
    if (scriptElement) {
        // If the script is already loaded, return a resolved promise
        return Promise.resolve();
    } else {
        // If not loaded, create a new promise to load the script
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.type = 'text/javascript';
    
            script.onload = () => {
                resolve(); // Resolve when the script is loaded
            };
    
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${src}`)); // Reject on error
            };
    
            document.body.appendChild(script); // Append the script to the body
        });
    }
}

async function PromiseloadScripts(scripts, functionName = 'none') {
	return new Promise(async (resolve, reject) => {
		try {
			// Loop through the scripts array and load them sequentially using async/await
			for (const src of scripts) {
				await loadScript(src);
			}

			// If a function name is provided, check if it exists and call it
			if (functionName !== 'none') {
				if (typeof window[functionName] === 'function') {
					window[functionName]();
				} else {
					console.error("Function " + functionName + " not found");
				}
			}

			// Resolve the promise when everything is done
			resolve(true);
		} catch (error) {
			// Reject the promise if an error occurs
			console.error(error);
			reject(error);
		}
	});
}

// Function to load all scripts
async function loadScripts(scripts, functionName = 'none') {
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
	return true
}

async function unloadScripts(scripts) {

	await scripts.forEach(script => {
		const scriptElement = document.querySelector(`script[src="${script}"]`);
		if (scriptElement) {
			scriptElement.remove();
		}
	});
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


function toast_alert(message, duration = 5000) {
	const toastElement = document.getElementById('liveToast');
	
	const toastInstance = new bootstrap.Toast(toastElement, {
		autohide: true, 
		delay: duration 
	  });

    const toastBody = toastElement.querySelector('.toast-body');
    toastBody.textContent = message;


    // Show the toast
    toastInstance.show();
}
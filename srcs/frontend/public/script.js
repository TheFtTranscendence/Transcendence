// Event listener for hash changes
window.addEventListener('hashchange', navigate);

//todo: test this on school chrome
window,onload = function() {

	try {
		console.log("HERE!");
		const store_user = JSON.parse(localStorage.getItem('user'));

		if (!store_user) {
			console.log("not saved!");
			window.location.hash = '#auth';
		} else {
			console.log("saved");
			window.user = new User(null, store_user);
			window.location.hash = '#home';
		}
	} catch (error) {
		console.error("An error occurred:", error);
		window.location.hash = '#auth';
	}

	//? what is this?
	if (window.frontendHealthCheck === false) 
	{
		window.frontendHealthCheck = true
		checkTournamentStatus()
	}

};

function navigate() {
	let element, scripts, startFunction;

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
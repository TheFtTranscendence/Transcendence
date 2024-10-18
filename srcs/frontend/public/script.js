window.addEventListener('hashchange', navigate);

navigate();

window.onload = function (e)	{
	window.location.hash = '#auth';
	navigate();
}

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

// Optional: Adding click event listeners to navigation links (not necessary if links have hrefs with hashes)
document.querySelectorAll('.nav-link').forEach(link => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		window.location.hash = link.getAttribute('href');
	});
});


// Event listener for hash changes


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
// Event listener for hash changes
window.addEventListener('hashchange', navigate);

//todo: test this on school chrome
window.onload = function() {

	try {
		console.log("HERE!");
		const stored_user = JSON.parse(localStorage.getItem('user'));

		if (!stored_user) {
			console.log("not saved!");
			window.location.hash = '#auth';
		} else {
			console.log("saved");
			window.user = new User(null, stored_user);
			window.user.init()
			window.location.hash = '#home';
		}
	} catch (error) {
		console.error("An error occurred:", error);
		window.location.hash = '#auth';
	}
};

window.onclose = function()	{
	window.user.cleanup();
}

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

		// case '#game':
		// 	element = 'games'
		// 	scripts = window.menuScripts
		// 	startFunction = 'main_menu'
		// 	break;

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

// Function to load a script and return a Promise
// async function loadScript(src) {
// 	await src.forEach(src => {
// 		const scriptElement = document.querySelector(`script[src="${src}"]`);
// 		console.log("Script element -> ", scriptElement)
// 		if (!scriptElement) {
// 			return new Promise((resolve, reject) => {
// 				const script = document.createElement('script');
// 				script.src = src;
// 				script.type = 'text/javascript';
		
// 				script.onload = () => {
// 					resolve();
// 				};
		
// 				script.onerror = () => {
// 					reject(new Error(`Failed to load script: ${src}`));
// 				};
		
// 				document.body.appendChild(script);
// 			});
// 		}
// 	});
// }

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

//? Is this the function beeing used? if yes why is it with the old url?
async function checkTournamentStatus()
{
	console.log("HERE CHECKING TOURNEY DATABASE")
	let pongyStatus = false
	console.log("BLOCKCHAIN_ID : ", window.user.blockchain_id)
	let url = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Pongy`;
	
	try {
		// Use await to wait for the fetch request to complete
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		
		// Check if the response is okay
		if (!response.ok) {
			throw new Error(`Error fetching data: ${response.statusText}`);
		}

		// Parse the response JSON
		const data = await response.json();
		
		// Store the status from the response
		pongyStatus = data.success;

		console.log('INITIAL PONGY STATUS:', pongyStatus); // Log the pongyStatus
		
	} catch (error) {
		// Handle any errors
		console.error('Error:', error);
	}
	
	let fightyStatus = false
	const url2 = `https://${window.IP}:3000/solidity/solidity/gettournamentstatus/${window.user.blockchain_id}/Fighty`;

	try {
		// Use await to wait for the fetch request to complete
		const response = await fetch(url2, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		
		// Check if the response is okay
		if (!response.ok) {
			throw new Error(`Error fetching data: ${response.statusText}`);
		}

		// Parse the response JSON
		const data = await response.json();
		
		// Store the status from the response
		fightyStatus = data.success;

		console.log('INITIAL FIGHTY STATUS:', fightyStatus); // Log the fightyStatus
		
	} catch (error) {
		// Handle any errors
		console.error('Error:', error);
	}

	if (pongyStatus)
		pongyTournamentData.retriveTournamentInfo()
	if (fightyStatus)
		fightyTournamentData.retriveTournamentInfo()

}
function auth_hashchange(event) {
	document.getElementById('auth').classList.add('hidden');
	unloadScripts(window.authScripts);
}

function auth() {
	document.querySelector('nav').classList.add('hidden');

	const authDiv = document.getElementById("auth");
	const loginForm = document.getElementById("loginForm");
	const registerForm = document.getElementById("registerForm");
	const loginError = document.getElementById("loginError");
	const registerError = document.getElementById("registerError");

	const leftSide = document.querySelector('.left-side');
	const rightSide = document.querySelector('.right-side');
	const leftContent = document.querySelector('.left-content');
	const rightContent = document.querySelector('.right-content');
	const leftForm = document.getElementById('login');
	const rightForm = document.getElementById('register');

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

	leftSide.addEventListener('click', function() {
		handleClick(leftSide, rightSide, leftContent, rightContent, leftForm, rightForm);
	});

	rightSide.addEventListener('click', function() {
		handleClick(rightSide, leftSide, rightContent, leftContent, rightForm, leftForm);
	});

	loginForm.addEventListener("submit", function(event) {
		event.preventDefault();
		const data = new FormData(loginForm);
		const username = data.get('username');
        const password = data.get('password');
		login(username, password)
		.catch(error => {
			loginError.textContent = error.message;
			loginError.classList.remove("hidden");
		});
	});

	registerForm.addEventListener("submit", function(event) {
		event.preventDefault();
		const data = new FormData(registerForm);
		const email = data.get('email');
		const username = data.get('username');
		const password = data.get('password');
        const confirm_password = data.get('confirm_password');
		login(email, username, password, confirm_password)
		.catch(error => {
			registerError.textContent = error.message;
			registerError.classList.remove("hidden");
		});
	});
}

// function handleSuccessAuth(errorField) {
// 	document.getElementById('auth').classList.add('hidden');
// 	document.querySelector('nav').classList.remove('hidden');
// 	window.location.hash = '#home';
// 	if (!errorField.classList.contains('hidden')) {
// 		errorField.classList.add('hidden');
// 	}

// 	// ? is this being useranywhere? it shouldn't
// 	// window.currentUser.username = window.user.username; // Ensure 'currentUser' is a global object
// 	//localStorage.setItem('currentUser', JSON.stringify(window.currentUser));

// 	// ? what is this ?
// 	if (window.frontendHealthCheck === false) 
// 	{
// 		window.frontendHealthCheck = true
// 		checkTournamentStatus()
// 	}
// }

async function checkTournamentStatus()
{
	console.log("HERE CHECKING TOURNEY DATABASE")
	let pongyStatus = false
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

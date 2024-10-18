function auth_hashchange(event) {
	document.getElementById('auth').classList.add('hidden');
	unloadScripts(window.authScripts);
}

function auth() {
	document.querySelector('nav').classList.add('hidden');

	window.location.hash = '#auth';
	document.getElementById('auth').classList.remove('hidden');
	window.addEventListener('hashchange', auth_hashchange);
}

function handleSuccessAuth(errorField) {
	document.getElementById('auth').classList.add('hidden');
	document.querySelector('nav').classList.remove('hidden');
	window.location.hash = '#home';
	if (!errorField.classList.contains('hidden')) {
		errorField.classList.add('hidden');
	}

	set_online();
	_update_user_chats();

}

async function handleLogin() {
	const username = document.getElementById('loginUsername').value;
	const password = document.getElementById('loginPassword').value;
	const errorField = document.getElementById('loginError');

	const data = {
		username: username,
		password: password,
	};

	await fetch(`https://${window.IP}:3000/user-management/auth/login/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.then(data => {
		window.user = data.user;
		window.usertoken = data.token;
		handleSuccessAuth(errorField);
	})
	.catch(error => {
		let errorMsg = "An unknown error occurred.";
		if (error && error.missing_fields) {
			if (error.missing_fields.includes('username')) {
				errorMsg = "Username is required.";
			}
			if (error.missing_fields.includes('password')) {
				errorMsg = "Password is required.";
			}
		} else {
			errorMsg = error.message || errorMsg;
		}
		errorField.textContent = errorMsg;
		errorField.classList.remove('hidden');
	});
}
// Define the event listener as a named function
function handleRegisterEvent(event) {
	event.preventDefault();

	if (window.isRegistering) {
		return;
	}

	handleRegister();
}

function handleRegister() {
	document.getElementById('registerForm').removeEventListener('submit', handleRegisterEvent);

	window.isRegistering = true;

	const username = document.getElementById('registerUsername').value;
	const password = document.getElementById('registerPassword').value;
	const confirm_password = document.getElementById('registerPasswordConfirm').value;
	const email = document.getElementById('registerEmail').value;
	const errorField = document.getElementById('registerError');

	const data = {
		email: email,
		username: username,
		password: password,
		confirm_password: confirm_password,
	};

	return fetch(`https://${window.IP}:3000/user-management/auth/register/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		return response.json();
	})
	.then(data => {
		window.user = data.user;
		window.usertoken = data.token;
		_update_user_chats();
		handleSuccessAuth(errorField, data.username);
	})
	.catch(error => {
		let errorMsg = "An unknown error occurred.";
		if (error && error.missing_fields) {
			if (error.missing_fields.includes('username')) {
				errorMsg = "Username is required.";
			}
			if (error.missing_fields.includes('password')) {
				errorMsg = "Password is required.";
			}
			if (error.missing_fields.includes('email')) {
				errorMsg = "Email is required.";
			}
			if (error.missing_fields.includes('confirm_password')) {
				errorMsg = "Confirm password is required.";
			}
		} else if (error.status === 409) {
			errorMsg = "Username already exists.";
		} else {
			errorMsg = error.message || errorMsg;
		}
		errorField.textContent = errorMsg;
		errorField.classList.remove('hidden');
	})
	.finally(() => {
		window.isRegistering = false;
	});
}

// Handle login and register forms
document.getElementById('loginForm').addEventListener('submit', (event) => {
	event.preventDefault();
	handleLogin();
});

// Add the event listener for the register form
document.getElementById('registerForm').addEventListener('submit', handleRegisterEvent);


// AUTH ANIMATION
function initElements() {
    window.leftSide = window.leftSide || document.querySelector('.left-side');
    window.rightSide = window.rightSide || document.querySelector('.right-side');
    window.rightContent = window.rightContent || document.querySelector('.right-content');
    window.leftContent = window.leftContent || document.querySelector('.left-content');
    window.leftForm = window.leftForm || document.getElementById('login');
    window.rightForm = window.rightForm || document.getElementById('register');
}


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

initElements();

leftSide.addEventListener('click', () => {
	handleClick(leftSide, rightSide, leftContent, rightContent, leftForm, rightForm);
});

rightSide.addEventListener('click', () => {
	handleClick(rightSide, leftSide, rightContent, leftContent, rightForm, leftForm);
});

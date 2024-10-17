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

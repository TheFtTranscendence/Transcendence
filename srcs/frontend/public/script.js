// Sample content for each route
const routes = {
    '#home': '<h1>Home Page</h1><p>Welcome to the home page!</p>',
    '#game': '<h1>Game</h1><canvas id="game-area"></canvas>',
    '#chat': '<h1>Chat</h1><p>Here can be eventually the chat</p>'
};


// Function to handle navigation
function navigate() {
    const hash = window.location.hash;
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = routes[hash] || '<h1>404 Not Found</h1><p>Page not found.</p>';

    if (hash === '#game')
        loadGameScript();
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

	axios.post('http://0.0.0.0:8001/login/', {
		username: username,
		password: password
	}, {
		withCredentials: true
	})
	.then((response) => {
		console.log(response.data);
		alert('Login successful');
	})
	.catch((error) => {
		console.error(error);
		alert('Login failed');
	});
}

function handleRegister() {
	const username = document.getElementById('registerUsername').value;
	const password = document.getElementById('registerPassword').value;
	const email = document.getElementById('registerEmail').value;

	axios.post('http://localhost:8001/register/', {
		username: username,
		password: password,
		email: email
	})
	.then((response) => {
		console.log(response.data);
		alert('Registration successful');
	})
	.catch((error) => {
		console.error(error);
		alert('Registration failed');
	});
}

// Handle login and register forms
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    // Mock authentication and transition to home page
	handleLogin();
	
    document.getElementById('auth').classList.add('hidden');
    document.querySelector('nav').classList.remove('hidden');
    window.location.hash = '#home';
    navigate();
});

document.getElementById('registerForm').addEventListener('submit', (event) => {
	event.preventDefault();

	// Mock registration and transition to home page
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

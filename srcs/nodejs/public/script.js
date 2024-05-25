// Sample content for each route
const routes = {
    '#home': '<h1>Home Page</h1><p>Welcome to the home page!</p>',
    '#game': '<h1>Game</h1><p>Here should be the Pong game</p>',
    '#chat': '<h1>Chat</h1><p>Here can be eventually the chat</p>'
};

// Function to handle navigation
function navigate() {
    const hash = window.location.hash;
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = routes[hash] || '<h1>404 Not Found</h1><p>Page not found.</p>';
}

// Show the appropriate auth page (login or register)
function showAuthPage(page) {
    document.querySelectorAll('.auth-page').forEach(el => el.classList.add('hidden'));
    document.getElementById(page).classList.remove('hidden');
}

// Handle login and register forms
function handleAuthForms() {
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        // Mock authentication and transition to home page
        document.getElementById('auth').classList.add('hidden');
        document.querySelector('nav').classList.remove('hidden');
        window.location.hash = '#home';
        navigate();
    });

    document.getElementById('registerForm').addEventListener('submit', (event) => {
        event.preventDefault();
        // Mock registration and transition to home page
        document.getElementById('auth').classList.add('hidden');
        document.querySelector('nav').classList.remove('hidden');
        window.location.hash = '#home';
        navigate();
    });

    document.getElementById('toRegister').addEventListener('click', () => {
        showAuthPage('register');
    });

    document.getElementById('toLogin').addEventListener('click', () => {
        showAuthPage('login');
    });
}

// Initial page load
window.addEventListener('load', () => {
    // Show login page initially
    showAuthPage('login');
    handleAuthForms();
});

// Event listener for hash changes
window.addEventListener('hashchange', navigate);

// Optional: Adding click event listeners to navigation links (not necessary if links have hrefs with hashes)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = link.getAttribute('href');
    });
});

document.getElementById('loginButton').addEventListener('click', handleLogin);

import axios from 'axios';

function handleLogin() {
	axios
		.get("http://0.0.0.0:8000/api/loginUser", {
			withCredentials: true,
		})
		.then((response) => {
			console.log(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}

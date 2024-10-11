function home_hashchange(event)
{
	document.getElementById('home').classList.add('hidden');
	unloadScripts(window.homeScripts);
}

function home()
{
	getAvatar()
	fillInfos()
	document.getElementById('home').classList.remove('hidden');
	window.addEventListener('hashchange', home_hashchange);
	document.getElementById('profile-img').addEventListener('click', showSideBar);
}

function showSideBar() {
	const sidebar = document.getElementById('sidebar');
	//event.stopPropagation();
	if (sidebar.classList.contains('hidden')) {
		document.addEventListener('click', handleOutsideClick);
		document.getElementById('sidebar').classList.remove('hidden');
	}
	// else {
	// 	document.removeEventListener('click', handleOutsideClick);
	// }
}

function handleOutsideClick(event) {
	const sidebar = document.getElementById('sidebar');
	const isClickInsideSidebar = sidebar.contains(event.target);
	const isClickProfile = document.getElementById('profile-img').contains(event.target);

	if (!isClickInsideSidebar && !isClickProfile) {
		sidebar.classList.add('hidden');
		document.removeEventListener('click', handleOutsideClick);
	}
}

//GET PROFILE PICTURE
function getAvatar() {
	const imgElement = document.querySelector('#profile-img img');

	if (window.user && window.user.avatar) {
		imgElement.src = "https://" + window.IP + ":3000/user-management/" + window.user.avatar;
	} else {
		imgElement.src = 'img/red.jpg';
	}

	document.getElementById('profile-img').classList.remove('hidden');
}

// CHANGE PROFILE PICTURE
//document.getElementById('uploadButton').addEventListener('click', triggerFileDialog);
//document.getElementById('changeProfilePicture').addEventListener('change', putAvatar);


function triggerFileDialog() {
	document.getElementById('changeProfilePicture').click();
}

function handleUpload() {
	const fileInput = document.getElementById('avatarInput');

	if (fileInput.files.length > 0) {
		uploadAvatar(fileInput.files[0]);
	} else {
		toast_alert('Please select a file to upload.');
	}
}

async function uploadAvatar(file) {
	const formData = new FormData();
	formData.append('avatar', file);

	try {
		const response = await fetch(`https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`, {
			method: 'PATCH',
			body: formData,
			headers: {
				'Authorization': 'Token ' + window.usertoken,
			},
		});

		if (!response.ok) {
			const errorData = await response.json(); // Parse error response if available
			throw new Error(errorData.message || 'Network response was not ok');
		}

		const data = await response.json();
		console.log('Avatar uploaded successfully:', data);
	} catch (error) {
		console.error('Error uploading avatar:', error);
	}
}

function changeNickname() {

}

// LOGOUT
document.getElementById('logoutButton').addEventListener('click', handleLogout);


function handleLogout() {
	const sidebar = document.getElementById('sidebar');

	document.querySelector('nav').classList.add('hidden');
	sidebar.classList.add('hidden');
	document.removeEventListener('click', handleOutsideClick);
	localStorage.removeItem('currentUser');
	window.location.hash = '#auth';
}

// CHANGE PASSWORD
document.getElementById('changePassword').addEventListener('click', handlePasswordChange);

function handlePasswordChange() {
	const changePasswordForm = document.getElementById('changePasswordForm');
	const submitButton = document.getElementById('submitPasswordChange');

	if (changePasswordForm) {
		if (changePasswordForm.classList.contains('hidden')) {
			console.log("remove hidden");
			changePasswordForm.classList.remove('hidden');
			// Add the event listener only if it's not already added
			if (!isListenerAdded) {
				submitButton.addEventListener('click', handlePasswordChangeForm);
				isListenerAdded = true; // Set to true when listener is added
			}
		} else {
			console.log("add hidden");
			changePasswordForm.classList.add('hidden');
			submitButton.removeEventListener('click', handlePasswordChangeForm);
			isListenerAdded = false; // Reset the status
		}
	} else {
		console.error('Element #changePasswordForm not found');
	}
}

function handlePasswordChangeForm(event) {
	event.preventDefault();

	const currentPassword = document.getElementById('currentPassword').value;
	const newPassword = document.getElementById('newPassword').value;
	const confirmNewPassword = document.getElementById('confirmNewPassword').value;
	const errorField = document.getElementById('changePasswordError');
	const changePasswordForm = document.getElementById('changePasswordForm');
	const sidebar = document.getElementById('sidebar');

	const data = {
		old_password: currentPassword,
		new_password: newPassword,
		confirm_new_password: confirmNewPassword
	};

	const url = `https://${window.IP}:3000/user-management/auth/users/${window.user.id}/`;

	fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Token ' + window.usertoken
		},
		body: JSON.stringify(data),
	})
	.then(response => {
		if (!response.ok) {
			return response.json().then(err => { throw err; });
		}
		toast_alert("Password change successful");
		errorField.classList.add('hidden');
		changePasswordForm.classList.add('hidden');
		sidebar.classList.add('hidden');
		document.removeEventListener('click', handleOutsideClick);
	})
	.catch(error => {
		toast_alert("Password not changed successful");
		errorField.textContent = error.message || "An error occurred. Please try again.";
		errorField.classList.remove('hidden');
	});
}


// GAME HISTORY TABLE



// dummy data
const Game = {
	timestamp: "",
	player1: "",
	player2: "",
	score1: "",
	score2: "",
	tournamentIndex: ""    // -1: not a tournament, then the index of the tournament
}


function	fillInfos() {
	fillGame()
	fillWinLoss()
	fillFriends()
}

function fillGame() {
	const table = document.getElementById('friendsTableBody')

}


function fillWinLoss() {
	const winCounter = document.getElementById('winCounter')
	const lossCounter = document.getElementById('lossCounter')
}

function fillFriends() {
	const table = document.getElementById('gameHistoryTableBody')

}


//! We should still put this inside a try but it should never happen
function	update_user_info() {
	userheaders = {
		'Authorization': 'Token ' + window.user.token,
	}

	axios.get(`http://${window.IP}:8000/auth/users/`, {headers: userheaders})
	.then((response) => {
		window.user = response.data;
		_update_user_chats()
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

//! This really needs to be inside a try because if the target user doesnt exist its going to raise an exception
//this works with both username and user ID
function	get_user_info(target) {
	userheaders = {
		'Authorization': 'Token ' + window.user.token,
	}

	axios.get(`http://${window.IP}:8000/auth/users/${target}/`, {headers: userheaders})
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

/*
	*This is only needed as an admin on the console
	*I dont think there is a need for the user to be able to delete his account
*/
//if no user is provided it will delete himself
function	delete_user(target = '') {
	if (target == '')	{
		url = `http://${window.IP}:8000/auth/users/`
	} else {
		url = `http://${window.IP}:8000/auth/users/${target}`
	}

	userheaders = {
		'Authorization': 'Token ' + window.user.token,
	}

	axios.delete(url, {headers: userheaders})
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}

//* The target part should only be used as an admin in the console, so once again, dont worry about it
function	modify_user(field, new_value, target='') {
	url = `http://${window.IP}:8000/auth/users/${target}`

	data = {
		[field]: new_value
	}

	userheaders = {
		'Authorization': 'Token ' + window.user.token,
	}

	axios.patch(url, {headers: userheaders}, data)
	.then((response) => {
		return response.data
	})
	.catch((error) => {
		if (error.response && error.response.data) {
			throw error.response.data;
		} else {
			throw new Error("An unknown error occurred");
		}
	})
}
